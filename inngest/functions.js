import { inngest } from './client'
import prisma from '@/lib/prisma'

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-create' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })
    }
)

// Inngest Function to update user data in database 
export const syncUserUpdation = inngest.createFunction(
    { id: 'sync-user-update' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.update({
            where: { id: data.id, },
            data: {
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })
    }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    { id: 'sync-user-delete' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.delete({
            where: { id: data.id, }
        })
    }
)

// Inngest Function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
    { id: 'delete-coupon-on-expiry' },
    { event: 'app/coupon.expired' },
    async ({ event, step }) => {
        const { data } = event
        const expiryDate = new Date(data.expires_at)
        await step.sleepUntil('wait-for-expiry', expiryDate)

        await step.run('delete-coupon-from-database', async () => {
            await prisma.coupon.delete({
                where: { code: data.code }
            })
        })
    }
)

// Abandoned Cart Recovery: Wait 24h and check if user placed an order 
export const abandonedCartRecovery = inngest.createFunction(
    { id: 'abandoned-cart-recovery' },
    { event: 'app/cart.updated' },
    async ({ event, step }) => {
        const { userId, cart } = event.data

        // Wait for 24 hours
        await step.sleep('wait-24h', '24h')

        // Check if user still has items in cart and hasn't placed an order
        const user = await step.run('check-cart-status', async () => {
            const u = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    buyerOrders: {
                        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
                    }
                }
            })
            return u
        })

        // If cart is not empty and no orders placed in last 24h
        if (user?.cart && Object.keys(user.cart).length > 0 && user.buyerOrders.length === 0) {
            await step.run('send-recovery-email', async () => {
                console.log(`Sending abandoned cart recovery email to: ${user.email}`)
                // In a real app, integrate Postmark/Resend/SendGrid here
            })
        }
    }
)

// Low Stock Alert: Notify seller when stock drops below threshold
export const lowStockAlerts = inngest.createFunction(
    { id: 'low-stock-alert' },
    { event: 'app/product.stock_updated' },
    async ({ event, step }) => {
        const { productId, stock, storeId } = event.data

        if (stock > 0 && stock < 5) {
            await step.run('notify-seller-low-stock', async () => {
                const store = await prisma.store.findUnique({
                    where: { id: storeId }
                })
                console.log(`ALERT: Low stock (${stock}) for product ${productId} in store ${store?.name}`)
                // Integration with notification service here
            })
        } else if (stock === 0) {
            await step.run('notify-seller-out-of-stock', async () => {
                const store = await prisma.store.findUnique({
                    where: { id: storeId }
                })
                console.log(`ALERT: Product ${productId} is OUT OF STOCK in store ${store?.name}`)
            })
        }
    }
)
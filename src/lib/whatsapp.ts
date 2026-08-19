// Configure your business WhatsApp number here (in international format without +)
const WHATSAPP_PHONE_NUMBER = '201145440767'; // Replace with your actual WhatsApp phone number

export function createWhatsAppOrderLink({
    productName,
    productUrl,
    language = 'en',
}: {
    productName: string;
    productUrl: string;
    language?: string;
}): string {
    const message =
        language === 'ar'
            ? `مرحباً، أود طلب المنتج التالي:\n*${productName}*\n\nرابط المنتج:\n${productUrl}`
            : `Hello, I would like to order this item:\n*${productName}*\n\nProduct Link:\n${productUrl}`;

    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
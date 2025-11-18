import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerName, customerEmail, customerPhone, total, items } = body;

    const adminEmail = 'digitalplay241@gmail.com';
    const adminWhatsApp = '+241074696109';

    // Prepare order details
    const itemsList = items.map((item: any) => `${item.name} x${item.quantity} - ${item.price} FCFA`).join('\n');
    const message = `
🔔 NOUVELLE COMMANDE - Digital Play

📦 Commande: #${orderId}
👤 Client: ${customerName}
📧 Email: ${customerEmail}
📱 Téléphone: ${customerPhone}

📝 Articles:
${itemsList}

💰 Total: ${total} FCFA

Contactez le client pour finaliser la commande.
    `.trim();

    // In a real app, you would use APIs like:
    // - SendGrid/Resend for email
    // - Twilio for WhatsApp
    // For now, we'll log the notification
    console.log('[v0] New order notification:', {
      to: { email: adminEmail, whatsapp: adminWhatsApp },
      message,
    });

    // Mock email sending
    const emailSent = true; // await sendEmail(adminEmail, 'Nouvelle commande Digital Play', message);
    
    // Mock WhatsApp sending (using WhatsApp Business API or Twilio)
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    const whatsappSent = true; // In real app: await sendWhatsApp(adminWhatsApp, message);

    return NextResponse.json({
      success: true,
      emailSent,
      whatsappSent,
      whatsappUrl, // Can be used to open WhatsApp manually
    });
  } catch (error) {
    console.error('[v0] Notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

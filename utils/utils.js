export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

console.log("Your OTP is:", generateOTP());

export function getOtpHtml(otp) {
    const safeOtp = String(otp).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character])

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            margin: 0;
            padding: 24px;
            background-color: #f4f7fb;
            color: #1f2937;
            font-family: Arial, Helvetica, sans-serif;
        }
        .container {
            max-width: 480px;
            margin: 40px auto;
            padding: 32px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background-color: #ffffff;
            text-align: center;
        }
        .otp {
            margin: 24px 0;
            padding: 16px;
            border-radius: 8px;
            background-color: #f3f4f6;
            color: #2563eb;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
        }
        .notice {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
        }
        @media only screen and (max-width: 520px) {
            body { padding: 12px; }
            .container { margin: 16px auto; padding: 24px 16px; }
            .otp { font-size: 28px; letter-spacing: 6px; }
        }
    </style>
</head>
<body>
    <main class="container">
        <h1>Verify your email</h1>
        <p>Use this one-time password to complete your verification:</p>
        <div class="otp">${safeOtp}</div>
        <p class="notice">This code expires in 10 minutes. If you didn't request it, you can safely ignore this email.</p>
    </main>
</body>
</html>`
}


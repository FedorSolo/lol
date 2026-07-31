import "server-only";
import { Resend } from "resend";

// Resend's shared testing domain — works immediately with no setup, no
// custom domain required. Once the site has its own domain (not
// *.vercel.app), switch this to something like "CUMBRE <info@cumbre.com>"
// after verifying that domain in the Resend dashboard.
const FROM_ADDRESS = "CUMBRE <onboarding@resend.dev>";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendClientInviteEmail({
  to,
  fullName,
  email,
  password,
  loginUrl,
}: {
  to: string;
  fullName: string;
  email: string;
  password: string;
  loginUrl: string;
}): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY не настроен" };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">CUMBRE</h1>
      <p>Здравствуйте, ${escapeHtml(fullName)}!</p>
      <p>Для вас создан личный кабинет участника экспедиции CUMBRE. В нём — программа тренировок,
      информация по маршруту, снаряжению и новости по вашей экспедиции.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #666;">Логин (email)</td>
          <td style="padding: 6px 0; font-weight: bold;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #666;">Пароль</td>
          <td style="padding: 6px 0; font-weight: bold; font-family: monospace;">${escapeHtml(password)}</td>
        </tr>
      </table>
      <p>
        <a href="${loginUrl}" style="display: inline-block; background: #0A0C0F; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 2px;">
          Войти в личный кабинет
        </a>
      </p>
      <p style="color: #666; font-size: 13px; margin-top: 24px;">
        Рекомендуем сменить пароль после первого входа. Если у вас есть вопросы — просто ответьте
        на это письмо.
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Ваш личный кабинет CUMBRE — данные для входа",
      html,
    });

    if (result.error) {
      return { sent: false, error: result.error.message };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Неизвестная ошибка отправки" };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

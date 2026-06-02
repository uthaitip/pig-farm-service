import axios from 'axios';
import MyRandom from 'src/libraries/my-random';

export class SmsService {
  static async sendOtp(params: { to: string; otp: string; ref: string }): Promise<boolean> {
    if (process.env.IS_NOT_SEND_OTP === 'true') {
      console.log(`[SMS Mock] To: ${params.to} | OTP: ${params.otp} | Ref: ${params.ref}`);
      return true;
    }
    try {
      await axios.post(
        'https://api-otp.ants.co.th/sms/send',
        {
          Messages: [
            {
              From: process.env.ANTS_SENDER || 'PigFarm',
              Destinations: [
                {
                  To: params.to,
                  MessageID: Date.now().toString() + MyRandom.stringWithNumber(4),
                },
              ],
              Text: `Your OTP is ${params.otp} Ref: ${params.ref}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ANTS_AUTH}`,
          },
        },
      );
      return true;
    } catch (e) {
      console.error('[SMS Error]', e?.response?.data ?? e.message);
      return false;
    }
  }
}

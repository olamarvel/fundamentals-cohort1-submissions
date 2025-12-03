import { LegacyUser, LegacyPayment } from './legacy-api.service';

// Kenyan names database
const kenyanNames = [
  { first: 'James', last: 'Mwangi', city: 'Nairobi', company: 'Safaricom Ltd' },
  { first: 'Mary', last: 'Wanjiku', city: 'Nairobi', company: 'Equity Bank' },
  { first: 'John', last: 'Ochieng', city: 'Kisumu', company: 'Lake Basin Mall' },
  { first: 'Grace', last: 'Akinyi', city: 'Kisumu', company: 'Kisumu County Services' },
  { first: 'Peter', last: 'Kamau', city: 'Nairobi', company: 'KCB Group' },
  { first: 'Sarah', last: 'Njeri', city: 'Nairobi', company: 'Nairobi Hospital' },
  { first: 'David', last: 'Kipchoge', city: 'Eldoret', company: 'Eldoret Sports Club' },
  { first: 'Esther', last: 'Chebet', city: 'Eldoret', company: 'Rift Valley Farmers Coop' },
  { first: 'Michael', last: 'Onyango', city: 'Mombasa', company: 'Mombasa Port Authority' },
  { first: 'Ruth', last: 'Achieng', city: 'Mombasa', company: 'Coast Tourism Board' },
];

const kenyanStreets = [
  'Tom Mboya Street',
  'Kenyatta Avenue',
  'Moi Avenue',
  'Harambee Avenue',
  'Wabera Street',
  'Koinange Street',
  'Kenyatta Street',
  'River Road',
  'Biashara Street',
  'Ngong Road',
];

const kenyanPaymentDescriptions = [
  'M-Pesa payment',
  'Bank transfer',
  'Airtime purchase',
  'Utility bill payment',
  'School fees payment',
  'Shopping payment',
  'Restaurant payment',
  'Transport payment',
  'Medical payment',
  'Insurance premium',
  'Loan repayment',
  'Savings deposit',
];

export class KenyanDataService {
  private nameIndex = 0;

  transformToKenyanUser(user: LegacyUser): LegacyUser {
    const kenyanData = kenyanNames[this.nameIndex % kenyanNames.length];
    this.nameIndex++;

    const phonePrefixes = ['0712', '0722', '0733', '0744', '0755', '0766', '0777', '0788', '0799'];
    const phoneSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const phone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${phoneSuffix}`;

    const streetIndex = Math.floor(Math.random() * kenyanStreets.length);
    const streetNumber = Math.floor(Math.random() * 999) + 1;

    return {
      ...user,
      name: `${kenyanData.first} ${kenyanData.last}`,
      username: `${kenyanData.first.toLowerCase()}.${kenyanData.last.toLowerCase()}`,
      email: `${kenyanData.first.toLowerCase()}.${kenyanData.last.toLowerCase()}@gmail.com`,
      phone: phone,
      address: {
        ...user.address,
        street: `${streetNumber} ${kenyanStreets[streetIndex]}`,
        city: kenyanData.city,
        zipcode: this.getKenyanPostalCode(kenyanData.city),
        geo: this.getKenyanCoordinates(kenyanData.city),
      },
      company: {
        name: kenyanData.company,
        catchPhrase: 'Harambee - Let us all pull together',
        bs: 'Empowering Kenyans',
      },
    };
  }

  transformToKenyanPayment(payment: LegacyPayment, customerName: string): LegacyPayment {
    const description = kenyanPaymentDescriptions[
      Math.floor(Math.random() * kenyanPaymentDescriptions.length)
    ];

    return {
      ...payment,
      currency: 'KES',
      description: `${description} - ${customerName}`,
    };
  }

  private getKenyanPostalCode(city: string): string {
    const postalCodes: Record<string, string> = {
      Nairobi: '00100',
      Kisumu: '40100',
      Eldoret: '30100',
      Mombasa: '80100',
      Nakuru: '20100',
      Thika: '01000',
    };
    return postalCodes[city] || '00100';
  }

  private getKenyanCoordinates(city: string): { lat: string; lng: string } {
    const coordinates: Record<string, { lat: string; lng: string }> = {
      Nairobi: { lat: '-1.2921', lng: '36.8219' },
      Kisumu: { lat: '-0.0917', lng: '34.7680' },
      Eldoret: { lat: '0.5143', lng: '35.2698' },
      Mombasa: { lat: '-4.0435', lng: '39.6682' },
      Nakuru: { lat: '-0.3031', lng: '36.0800' },
      Thika: { lat: '-1.0333', lng: '37.0694' },
    };
    return coordinates[city] || { lat: '-1.2921', lng: '36.8219' };
  }
}

export const kenyanDataService = new KenyanDataService();


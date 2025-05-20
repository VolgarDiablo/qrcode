export type CountryConfig = {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  timezone: string;
  dateFormat: string;
  phoneRegex: RegExp;
};

const configs: Record<string, CountryConfig> = {
  UA: {
    code: 'UA',
    name: 'Ukraine',
    currency: 'UAH',
    currencySymbol: '₴',
    locale: 'uk-UA',
    timezone: 'Europe/Kyiv',
    dateFormat: 'DD.MM.YYYY',
    phoneRegex: /^\+380\d{9}$/,
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'nl-BE',
    timezone: 'Europe/Brussels',
    dateFormat: 'DD/MM/YYYY',
    phoneRegex: /^\+32\d{8,9}$/,
  },
};

export const getConfigCountry = (): CountryConfig => {
  const code = process.env.APP_COUNTRY || 'UA';
  return configs[code] || configs.UA;
};

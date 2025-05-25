export type CountryConfig = {
  code: string;
  name: string;
  phoneRegex: RegExp;
};

const configs: Record<string, CountryConfig> = {
  UA: {
    code: 'UA',
    name: 'Ukraine',
    phoneRegex: /^\+380\d{9}$/,
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    phoneRegex: /^\+32\d{8,9}$/,
  },
};

export const getConfigCountry = (): CountryConfig => {
  const code = process.env.APP_COUNTRY || 'UA';
  return configs[code] || configs.UA;
};

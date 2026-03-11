import { TAX_IDS, TaxId } from './TaxID.constants'

export const getTaxIdCountry = (taxId: TaxId): string => taxId.taxCountryIso2 ?? taxId.countryIso2

export const findTaxIdOption = (type: string, country: string, billingCountry?: string) => {
  if (billingCountry) {
    const match = TAX_IDS.find(
      (option) => option.type === type && option.countryIso2 === billingCountry
    )
    if (match) return match
  }

  return TAX_IDS.find(
    (option) => option.type === type && getTaxIdCountry(option) === country
  )
}

export const sanitizeTaxIdValue = (taxId: { name: string; value: string }) => {
  const selectedTaxId = TAX_IDS.find((option) => option.name === taxId.name)

  const vatIdPrefix = selectedTaxId?.vatPrefix

  // if the value doesn't start with the prefix, prepend them
  if (vatIdPrefix && !taxId.value.startsWith(vatIdPrefix)) {
    return `${vatIdPrefix}${taxId.value}`
  }

  return taxId.value
}

/** Ignore id property amongst tax ids */
export const checkTaxIdEqual = (a: any, b: any) => {
  return a?.type === b?.type && a?.value === b?.value
}

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import _ from 'lodash'

import { type APIHost } from 'services/API/types'
import { apiFetch } from 'utils/api'

interface AllowedFieldValuesContextProps {
  propertyTypeOptions: string[]
  styleOptions: string[]
  lastStatusOptions: string[]
}

const AllowedFieldValuesContext = createContext<AllowedFieldValuesContextProps>(
  {
    propertyTypeOptions: [],
    styleOptions: [],
    lastStatusOptions: []
  }
)

const fields = [
  { appField: 'propertyType', repliersField: 'details.propertyType' },
  { appField: 'style', repliersField: 'details.style' },
  { appField: 'lastStatus', repliersField: 'lastStatus' }
]

const flattenAllowedFieldValues = (aggregates: object, fields: any[]) => {
  return fields.reduce(
    (acc: Record<string, string[]>, { appField, repliersField }) => {
      const obj = _.get(aggregates, repliersField)
      if (obj && typeof obj === 'object') {
        acc[appField] = Object.keys(obj)
      }
      return acc
    },
    {}
  )
}

const fetchAllowedFieldValues = async (apiKey: string, apiUrl: string) => {
  const fieldNames = fields.map(({ repliersField }) => repliersField)
  const getOptions = {
    get: {
      listings: 'false',
      aggregates: fieldNames.join(','),
      status: ['A', 'U']
    }
  }
  const options = { headers: { 'REPLIERS-API-KEY': apiKey } }
  const response = await apiFetch(`${apiUrl}/listings`, getOptions, options)
  if (!response.ok) {
    throw new Error('[fetchAllowedFieldValue]: could not fetch locations')
  }
  const { aggregates } = await response.json()
  return flattenAllowedFieldValues(aggregates, fields)
}

type Props = APIHost & { children: React.ReactNode }

export const AllowedFieldValuesProvider: React.FC<Props> = ({
  apiKey,
  apiUrl,
  children
}) => {
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([])
  const [styleOptions, setStyleOptions] = useState<string[]>([])
  const [lastStatusOptions, setLastStatusOptions] = useState<string[]>([])

  useEffect(() => {
    if (!apiKey || !apiUrl) return
    fetchAllowedFieldValues(apiKey, apiUrl)
      .then((values) => {
        const { propertyType = [], style = [], lastStatus = [] } = values
        setPropertyTypeOptions(propertyType)
        setStyleOptions(style)
        setLastStatusOptions(lastStatus)

        // eslint-disable-next-line no-console
        console.log('Allowed field values fetched:', values)
      })
      .catch((error) => {
        console.error('Error fetching allowed field values:', error)
      })
  }, [apiKey, apiUrl])

  const contextValue = useMemo(
    () => ({
      propertyTypeOptions,
      styleOptions,
      lastStatusOptions
    }),
    [propertyTypeOptions, styleOptions, lastStatusOptions]
  )

  return (
    <AllowedFieldValuesContext.Provider value={contextValue}>
      {children}
    </AllowedFieldValuesContext.Provider>
  )
}

export const useAllowedFieldValues = () => useContext(AllowedFieldValuesContext)

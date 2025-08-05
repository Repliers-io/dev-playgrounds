import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { alpha, Box, Button, ButtonGroup, Skeleton } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import './CardsCarousel.css'

import PropertyCard from './PropertyCard'

const CardsCarousel = ({ open }: { open: boolean }) => {
  const { listings } = useSearch()
  const { focusedMarker, focusMarker } = useMapOptions()
  const { setValue } = useFormContext()
  const { onChange } = useParamsForm()
  const ref = useRef<HTMLDivElement>(null)
  const prevFocusedMarker = useRef<HTMLElement | null>(null)

  const cardWidth = 258
  const scrollBy = cardWidth * 1 // one card at a time

  const handleNextClick = () =>
    ref.current?.scrollBy({ left: scrollBy, behavior: 'smooth' })

  const handlePrevClick = () =>
    ref.current?.scrollBy({ left: -scrollBy, behavior: 'smooth' })

  const handleDetailsClick = (mlsNumber: string, boardId: number) => {
    // Switch to property tab
    setValue('tab', 'listing')
    // Fill property fields
    setValue('mlsNumber', mlsNumber)
    setValue('listingBoardId', boardId)
    // Trigger form change
    onChange()
  }

  useEffect(() => {
    ref.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [listings])

  useEffect(() => {
    prevFocusedMarker.current?.classList.remove('focused')
    if (focusedMarker) {
      const card = document.getElementById('card-' + focusedMarker)
      card?.classList.add('focused')
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      prevFocusedMarker.current = card
    }
  }, [focusedMarker])

  return (
    <Box
      sx={{
        display: open ? 'block' : 'none',
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16
      }}
    >
      {Boolean(listings.length) && (
        <ButtonGroup
          size="small"
          orientation="horizontal"
          sx={{
            position: 'absolute',
            left: 50,
            top: -52,
            boxShadow: 1,
            backdropFilter: 'blur(4px)',
            bgcolor: alpha('#FFFFFF', 0.7),
            '& .MuiButton-root': { height: 36, minWidth: 0, p: 1.125 },
            '& .MuiButtonGroup-groupedHorizontal.MuiButtonGroup-firstButton': {
              '&::after': {
                display: 'none'
              }
            }
          }}
        >
          <Button onClick={handlePrevClick}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </Button>
          <Button onClick={handleNextClick}>
            <ArrowForwardIcon sx={{ fontSize: 20 }} />
          </Button>
        </ButtonGroup>
      )}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
          height: '100px',
          overflow: 'visible',
          px: 1
        }}
      >
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            boxSizing: 'border-box',
            overflowY: 'hidden',
            overflowX: 'auto',
            pt: 1,
            pb: 3.25,
            pl: 0,
            pr: 0,
            scrollbarWidth: 'thin'
          }}
        >
          {!listings.length && (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  sx={{ minWidth: 232, height: 84, mr: 1 }}
                />
              ))}
            </>
          )}
          {listings.map((listing, index) => (
            <PropertyCard
              key={index}
              listing={listing}
              onClick={focusMarker}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default CardsCarousel

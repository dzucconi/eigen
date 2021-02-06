import { useContext } from "react"
import { ArtworkFilterContext } from "./ArtworkFiltersStore"
import { filterArtworksParams } from "./FilterArtworksHelpers"

export const useArtworkFilters = () => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)

  return {
    dispatch,
    state,
    filterParams,
  }
}

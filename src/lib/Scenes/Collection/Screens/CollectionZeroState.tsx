import { color, Flex, Serif } from "@artsy/palette"
import React, { useContext } from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { ArtworkFilterContext } from "../../../utils/ArtworkFiltersStore"

export const CollectionZeroState: React.SFC = () => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const refetchArtworks = () => {
    dispatch({ type: "clearFiltersZeroState" })
  }

  return (
    <ZeroStateContainer>
      <ZeroStateMessage size="4">
        There aren't any works available that meet the following criteria at this time. Change your filter criteria to
        view more works.
      </ZeroStateMessage>
      <TouchableOpacity onPress={refetchArtworks}>
        <ZeroStateClearAllMessage size="4">Clear all filters</ZeroStateClearAllMessage>
      </TouchableOpacity>
    </ZeroStateContainer>
  )
}

const ZeroStateClearAllMessage = styled(Serif)`
  color: ${color("black100")};
  text-align: center;
  text-decoration: underline;
`
const ZeroStateMessage = styled(Serif)`
  color: ${color("black100")};
  text-align: center;
`
const ZeroStateContainer = styled(Flex)`
  padding: 35px;
  flex-direction: column;
  margin-top: 300px;
  margin-bottom: 300px;
`
import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import { get } from "lib/utils/get"
import { Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useArtworkFilters } from "lib/utils/ArtworkFilter/useArtworkFilters"

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const { state, filterParams } = useArtworkFilters()

  const [isFilterArtworksModalVisible, setIsFilterArtworksModalVisible] = useState(false)
  const artworks = get(partner, (p) => p.artworks)

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        30,
        (error) => {
          if (error) {
            throw new Error("Fair/FairArtworks filter error: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  return (
    <>
      <StickyTabPageScrollView>
        <Spacer mb={2} />

        <Text>{JSON.stringify(state)}</Text>

        {artworks ? (
          <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} hasMore={relay.hasMore} />
        ) : (
          <TabEmptyState text="There is no artwork from this gallery yet" />
        )}
      </StickyTabPageScrollView>

      <AnimatedArtworkFilterButton
        isVisible={true}
        onPress={() => {
          setIsFilterArtworksModalVisible(true)
        }}
      />

      <FilterModalNavigator
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
        id={partner.internalID}
        slug={partner.slug}
        mode={FilterModalMode.Partner}
        exitModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
        closeModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
      />
    </>
  )
}

export const PartnerArtworkFragmentContainer = createPaginationContainer(
  PartnerArtwork,
  {
    partner: graphql`
      fragment PartnerArtwork_partner on Partner
      @argumentDefinitions(
        # 10 matches the PAGE_SIZE constant. This is required. See MX-316 for follow-up.
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        sort: { type: "String", defaultValue: "-partner_updated_at" }
      ) {
        internalID
        slug
        artworks: filterArtworksConnection(sort: $sort, first: $count, after: $cursor)
          @connection(key: "Partner_artworks") {
          # TODO: Just to satisfy relay-compiler
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.partner && props.partner.artworks
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerArtworkInfiniteScrollGridQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerArtwork_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

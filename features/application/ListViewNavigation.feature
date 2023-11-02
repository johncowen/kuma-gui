Feature: application / ListViewNavigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                                           |
      | main-nav    | .app-sidebar                                       |
      | detail-link | tbody tr:nth-child(1) [data-testid='details-link'] |

    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: bandwidth-0
      """

  Scenario Outline: The <URL> list view has correct detail view link
    When I visit the "<URL>" URL
    And I click the "$detail-link" element

    Then the URL contains "<URL>"
    Then the URL contains "<DetailURL>"

    Examples:
      | URL                          | DetailURL |
      | /zones                       | /overview |
      | /zones/bandwidth-0/egresses  | /overview |
      | /zones/bandwidth-0/ingresses | /overview |
      | /meshes                      | /overview |
      | /meshes/default/gateways     | /overview |
      | /meshes/default/data-planes  | /overview |
      | /meshes/default/services     | /overview |
      | /meshes/default/policies     | /overview |

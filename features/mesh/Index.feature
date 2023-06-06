Feature: mesh / index
  Background:
    Given the CSS selectors
      | Alias           | Selector       |
      | mesh-breadcrumb | .k-breadcrumbs |

  Scenario: Mesh Selection
    Given the environment
      """
      KUMA_MESH_COUNT: 2
      """
    And the URL "/meshes" responds with
      """
      body:
        items:
          - name: default
          - name: another-mesh
      """
    When I visit the "/meshes" URL

    When I click the "<Selector>" element
    Then the URL contains "/mesh/<Mesh>"
    And the "$mesh-breadcrumb" element contains "<Mesh>"

    Examples:
      | Mesh         | Selector |
      | another-mesh | [data-testid='data-overview-table'] tbody tr:nth-child(2) [data-testid='detail-view-link'] |
      | default      | [data-testid='data-overview-table'] tbody tr:nth-child(1) [data-testid='detail-view-link'] |

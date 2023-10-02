Feature: mesh / dataplanes / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                              |
      | table           | [data-testid='data-plane-collection'] |
      | table-header    | $table th                             |
      | table-row       | $table tbody tr                       |
      | dataplane-title | [data-testid='data-plane-collection'] |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 9
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/meshes/default/dataplanes+insights" responds with
      """
      body:
        items:
        - name: fake-backend
          mesh: fake-default
          dataplane:
            networking:
              inbound:
              - tags:
                  kuma.io/protocol: http
          dataplaneInsight:
            subscriptions:
            - status:
                lastUpdateTime: 2021-02-16T08:33:36.442044+01:00
            - status:
                lastUpdateTime: 2021-02-18T08:33:36.442044+01:00
        - name: fake-frontend
      """

  Scenario: The Proxy listing table has the correct columns (mode: global)
    Given the environment
      """
      KUMA_MODE: global
      """

    When I visit the "/mesh/default/data-planes" URL

    Then the "$table-header" element exists 9 times
    And the "$table-header" elements contain
      | Value              |
      | Name               |
      | Service            |
      | Protocol           |
      | Zone               |
      | Last Updated       |
      | Certificate Expiry |
      | Status             |
      | Warnings           |

  Scenario: The Proxy listing table has the correct columns (mode: standalone)
    Given the environment
      """
      KUMA_MODE: standalone
      """

    When I visit the "/mesh/default/data-planes" URL

    Then the "$table-header" element exists 8 times
    And the "$table-header" elements contain
      | Value              |
      | Name               |
      | Service            |
      | Protocol           |
      | Last Updated       |
      | Certificate Expiry |
      | Status             |
      | Warnings           |

  Scenario: The Proxy listing has the expected content and UI elements
    When I visit the "/mesh/default/data-planes" URL

    Then the "$table-row" element exists 9 times
    Then the "$table-row:nth-child(1)" element contains
      | Value        |
      | fake-backend |
      | http         |
      | Feb 18, 2021 |

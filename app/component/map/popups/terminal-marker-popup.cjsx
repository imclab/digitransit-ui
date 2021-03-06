React                 = require 'react'
Relay                 = require 'react-relay'
queries               = require '../../../queries'
DepartureListContainer = require('../../departure/DepartureListContainer').default
Icon                  = require '../../icon/icon'
Link                  = require 'react-router/lib/Link'
MarkerPopupBottom     = require '../marker-popup-bottom'
NotImplementedLink = require '../../util/not-implemented-link'
{FormattedMessage} = require('react-intl')
moment             = require 'moment'
sortBy = require 'lodash/sortBy'
naturalSort = require 'javascript-natural-sort'

class TerminalMarkerPopup extends React.Component

  render: ->
    stops = @props.terminal.stops.slice().sort((a, b) -> naturalSort(a.platformCode, b.platformCode)).map (stop, i) ->
      mode = stop.routes[0].mode.toLowerCase()
      <Link to="/pysakit/#{stop.gtfsId}" key={stop.gtfsId} className="no-decoration">
        <div className="platform padding-small">
          <Icon className={mode + " platform-icon"} img={'icon-icon_' + mode}/>
          <div className="platform-texts">
            <span className="platform-name sub-header-h4">
              <FormattedMessage
                id='platform-num'
                defaultMessage="Platform {platformCode}"
                values={
                  platformCode: stop.platformCode
                }/>
            </span>
            <div className={mode + " platform-routes"}>
              {sortBy(stop.routes, (route) -> route.shortName or route.longName)
                .map((route) -> route.shortName or route.longName).join(', ')}
            </div>
          </div>
        </div>
      </Link>

    <div className="card">
      <div className="padding-small h4">
        {@props.terminal.name}
        {@props.terminal.desc}
      </div>
      <div className="terminal-platforms">
        {stops}
      </div>
      <MarkerPopupBottom location={{
        address: @props.terminal.name
        lat: @props.terminal.lat
        lon: @props.terminal.lon
      }}/>
    </div>


module.exports = Relay.createContainer TerminalMarkerPopup,
  fragments: queries.TerminalMarkerPopupFragments

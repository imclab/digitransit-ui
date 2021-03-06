import React from 'react';
import Relay from 'react-relay';
import StopRoute from '../../../route/StopRoute';
import StopMarkerPopup from '../popups/stop-marker-popup';
import provideContext from 'fluxible-addons-react/provideContext';
import { intlShape } from 'react-intl';
import GenericMarker from '../GenericMarker';
import Icon from '../../icon/icon';
import config from '../../../config';
import { getCaseRadius, getStopRadius, getHubRadius } from '../../../util/mapIconUtils';


const isBrowser = typeof window !== 'undefined' && window !== null;

let L;

/* eslint-disable global-require */
// TODO When server side rendering is re-enabled,
//      these need to be loaded only when isBrowser is true.
//      Perhaps still using the require from webpack?
if (isBrowser) {
  L = require('leaflet');
}
/* eslint-enable global-require */

const StopMarkerPopupWithContext = provideContext(StopMarkerPopup, {
  intl: intlShape.isRequired,
  router: React.PropTypes.object.isRequired,
  route: React.PropTypes.object.isRequired,
});

class StopMarker extends React.Component {
  static propTypes = {
    stop: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string.isRequired,
    renderName: React.PropTypes.bool,
    disableModeIcons: React.PropTypes.bool,
    selected: React.PropTypes.bool,
  };

  static contextTypes = {
    getStore: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.object.isRequired,
    route: React.PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };


  getModeIcon = (zoom) => {
    const iconId = `icon-icon_${this.props.mode}`;
    const icon = Icon.asString(iconId, 'mode-icon');
    let size;
    if (zoom <= config.stopsSmallMaxZoom) {
      size = 8;
    } else if (this.props.selected) {
      size = 28;
    } else {
      size = 18;
    }

    return L.divIcon({
      html: icon,
      iconSize: [size, size],
      className: `${this.props.mode} cursor-pointer`,
    });
  }

  getIcon = (zoom) => {
    const scale = this.props.stop.transfer || this.props.selected ? 1.5 : 1;
    const calcZoom = this.props.stop.transfer || this.props.selected ? Math.max(zoom, 15) : zoom;

    const radius = getCaseRadius({ $zoom: calcZoom }) * scale;
    const stopRadius = getStopRadius({ $zoom: calcZoom }) * scale;
    const hubRadius = getHubRadius({ $zoom: calcZoom }) * scale;

    const inner = (stopRadius + hubRadius) / 2;
    const stroke = stopRadius - hubRadius;

    // see app/util/mapIconUtils.js for the canvas version
    let iconSvg = `
      <svg viewBox="0 0 ${radius * 2} ${radius * 2}">
        <circle class="stop-halo" cx="${radius}" cy="${radius}" r="${radius}"/>
        <circle class="stop" cx="${radius}" cy="${radius}" r="${inner}" stroke-width="${stroke}"/>
        ${inner > 7 && this.props.stop.platformCode ?
          `<text x="${radius}" y="${radius}" text-anchor="middle" dominant-baseline="central"
            fill="#333" font-size="${1.2 * inner}px"
            font-family="Gotham XNarrow SSm A, Gotham XNarrow SSm B, Arial, sans-serif"
            >${this.props.stop.platformCode}</text>`
          : ''}
      </svg>
    `;

    if (radius === 0) {
      iconSvg = '';
    }

    return L.divIcon({
      html: iconSvg,
      iconSize: [radius * 2, radius * 2],
      className: `${this.props.mode} cursor-pointer`,
    });
  }

  render() {
    if (!isBrowser) {
      return '';
    }

    return (
      <GenericMarker
        position={{
          lat: this.props.stop.lat,
          lon: this.props.stop.lon,
        }}
        getIcon={
          config.map.useModeIconsInNonTileLayer && !this.props.disableModeIcons ?
          this.getModeIcon : this.getIcon
        }
        id={this.props.stop.gtfsId}
        renderName={this.props.renderName}
        name={this.props.stop.name}
      >
        <Relay.RootContainer
          Component={StopMarkerPopup}
          route={new StopRoute({
            stopId: this.props.stop.gtfsId,
            date: this.context.getStore('TimeStore').getCurrentTime().format('YYYYMMDD'),
          })}
          renderLoading={() =>
            <div className="card" style={{ height: 150 }}><div className="spinner-loader" /></div>
          }
          renderFetched={data =>
            <StopMarkerPopupWithContext {...data} context={this.context} />
          }
        />
      </GenericMarker>
    );
  }
}

export default StopMarker;

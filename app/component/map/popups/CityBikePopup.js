import React from 'react';
import Relay from 'react-relay';
import MarkerPopupBottom from '../marker-popup-bottom';
import CityBikeContent from '../../city-bike/CityBikeContent';
import CityBikeCard from '../../city-bike/CityBikeCard';
import { station as exampleStation } from '../../documentation/ExampleData';
import ComponentUsageExample from '../../documentation/ComponentUsageExample';

class CityBikePopup extends React.Component {
  static contextTypes = {
    getStore: React.PropTypes.func.isRequired,
  };

  static description = (
    <div>
      <p>Renders a citybike popup.</p>
      <ComponentUsageExample description="">
        <CityBikePopup context="context object here" station={exampleStation}>
          Im content of a citybike card
        </CityBikePopup>
      </ComponentUsageExample>
    </div>);

  static displayName = 'CityBikePopup';

  static propTypes = {
    station: React.PropTypes.object.isRequired,
    context: React.PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="card">
        <CityBikeCard className="padding-small" station={this.props.station}>
          <CityBikeContent
            lang={this.context.getStore('PreferencesStore').getLanguage()}
            station={this.props.station}
          />
        </CityBikeCard>
        <MarkerPopupBottom
          location={{
            address: this.props.station.name,
            lat: this.props.station.lat,
            lon: this.props.station.lon,
          }}
        /></div>);
  }
}

export default Relay.createContainer(CityBikePopup, {
  fragments: {
    station: () => Relay.QL`
      fragment on BikeRentalStation {
        stationId
        name
        lat
        lon
        bikesAvailable
        spacesAvailable
      }
    `,
  },
});
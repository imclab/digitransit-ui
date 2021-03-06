import React, { PropTypes } from 'react';
import cx from 'classnames';
import ComponentUsageExample from '../documentation/ComponentUsageExample';
import { realtimeDeparture as ExampleData } from '../documentation/ExampleData';
import { intlShape } from 'react-intl';

function RouteDestination(props, context) {
  let destination;
  if (props.isArrival) {
    destination = (
      <span className="destination arrival">
        <span className={cx('last-stop-icon', props.mode.toLowerCase())}></span>
        <span>
        {context.intl.formatMessage({
          id: 'route-destination-arrives',
          defaultMessage: 'Arriving / Last stop',
        })}
        </span>
      </span>);
  } else {
    destination = <span className="destination">{props.destination}</span>;
  }

  return (
    <span className={cx('route-destination', props.className)}>
      {destination}
    </span>);
}

RouteDestination.description = (
  <div>
    <p>Display the destination of the route (headsign)</p>
    <ComponentUsageExample>
      <RouteDestination
        mode={ExampleData.pattern.route.mode}
        destination={ExampleData.pattern.headsign ||
            ExampleData.pattern.route.longName}
      />
    </ComponentUsageExample>
    <ComponentUsageExample
      description="isArrival true"
    >
      <RouteDestination
        mode={ExampleData.pattern.route.mode}
        destination={ExampleData.pattern.headsign ||
            ExampleData.pattern.route.longName}
        isArrival
      />
    </ComponentUsageExample>
  </div>);

RouteDestination.propTypes = {
  mode: PropTypes.string,
  destination: PropTypes.string,
  className: PropTypes.string,
  isArrival: PropTypes.bool,
};

RouteDestination.contextTypes = {
  intl: intlShape.isRequired,
};

RouteDestination.displayName = 'RouteDestination';
export default RouteDestination;

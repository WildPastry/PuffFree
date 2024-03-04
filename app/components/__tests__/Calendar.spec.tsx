/* eslint-disable no-console */
import Calendar from '../Calendar';
import { Provider } from 'react-redux';
import { makeStore } from '../../redux/store';
import renderer from 'react-test-renderer';
import { useState } from 'react';

describe('<Calendar />', () => {
  it('renders correctly', () => {
    const store = makeStore();
    const [change, setChange] = useState<boolean>(false);
    const [position, setPosition] = useState<boolean>(false);

    // Mock functions
    const mockCalendarChange = (): void => {
      setChange(true);
      console.log(change);
    };

    const mockScrollPosition = (): void => {
      setPosition(true);
      console.log(position);
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <Calendar
            handleCalendarChange={mockCalendarChange}
            handleScrollPosition={mockScrollPosition}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

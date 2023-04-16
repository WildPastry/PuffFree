import {
  constructDateFromId,
  setCurrentDate,
  setCurrentDay
} from '../redux/slices/dateSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { AppState } from '../redux/store';
import Calendar from '../components/Calendar';
import Colors from '../constants/Colors';
import ErrorScreen from './ErrorScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen';
import { MonoText } from '../components/StyledText';
import Reflection from '../components/Reflection';
import { ScrollView } from '../components/Themed';
import { StyleSheet } from 'react-native';
import { setData } from '../redux/slices/dataSlice';
import useColorScheme from '../../app/hooks/useColorScheme';

const Home: React.FC = (): JSX.Element => {
  // Selectors for store
  const appLoading = useAppSelector((state: AppState): boolean => {
    return state.data.loading;
  });

  const appError = useAppSelector((state: AppState): boolean => {
    return state.data.error;
  });

  // Colour settings
  const colorScheme = useColorScheme();

  // Dispatch settings
  const dispatch = useAppDispatch();

  // Local data
  const [showCalendar, setShowCalendar] = useState(false);

  // Effect for setting app data
  useEffect((): void => {
    dispatch(setData());
  }, [setData]);

  // Error screen
  const errorScreen = (): JSX.Element => {
    return <ErrorScreen />;
  };

  // Hide or show calendar
  const toggleCalendar = (): void => {
    setShowCalendar(!showCalendar);
  };

  // Update the current reflection
  const updateReflection = (
    showCalendar: boolean,
    currentDay: string
  ): void => {
    const currentDate: number = constructDateFromId(currentDay);
    // Set calendar status
    setShowCalendar(showCalendar);
    // Update store
    dispatch(setCurrentDate(currentDate));
    dispatch(setCurrentDay(currentDay));
  };

  // Render app
  const renderApp = (appLoading: boolean) => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {appLoading ? (
          <LoadingScreen />
        ) : (
          <ScrollView>
            {/* Logo */}
            <FontAwesome5
              style={styles.text}
              name='chair'
              size={50}
              color={Colors[colorScheme].text}
            />
            {/* Title */}
            <MonoText style={styles.title}>Just for today</MonoText>
            {/* Calendar icon */}
            <FontAwesome5
              style={styles.text}
              name='calendar-alt'
              size={25}
              onPress={() => toggleCalendar()}
              color={Colors[colorScheme].text}
            />
            {/* Components */}
            {showCalendar ? (
              <Calendar handleCalendarChange={updateReflection} />
            ) : (
              <Reflection />
            )}
          </ScrollView>
        )}
      </ScrollView>
    );
  };
  // Check for error state
  return appError ? errorScreen() : renderApp(appLoading);
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    textAlign: 'center'
  }
});

export default Home;

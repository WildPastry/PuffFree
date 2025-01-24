import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';
import { EDateFormat, IDate } from '../types/date.types';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { IDeviceSize, IReflectionComponent } from '../types/generic.types';
import React, { useEffect, useState } from 'react';
import { Text, View } from './styles/Themed';
import { add, format } from 'date-fns';
import {
  constructDateFromId,
  setSelectedDate,
  setSelectedDay
} from '../redux/slices/dateSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { AppState } from '../redux/store';
import Calendar from './Calendar';
import Colours from '../constants/Colours';
import Control from '../constants/Control';
import { IReflection } from '../types/data.types';
import getDeviceSize from '../constants/Layout';
import useColorScheme from '../hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';
import ShareComponent from './Share';

const Reflection: React.FC<IReflectionComponent> = ({
  handleScrollPosition
}: IReflectionComponent): JSX.Element => {
  // Component settings
  const dispatch = useAppDispatch();
  const deviceSize: IDeviceSize[keyof IDeviceSize] = getDeviceSize();
  const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [reflection, setReflection] = useState<IReflection>({
    id: '',
    date: '',
    title: '',
    quote: '',
    source: '',
    reflection: ''
  });

  // Data from store
  const reflections: IReflection[] = useAppSelector(
    (state: AppState): IReflection[] => {
      return state.data.reflections;
    }
  );

  const dates: IDate = useAppSelector((state: AppState): IDate => {
    return state.date;
  });

  // Effect for hiding the calendar when unfocused
  useFocusEffect(
    React.useCallback(() => {
      return () => setShowCalendar(false);
    }, [])
  );

  // Effect for setting the current reflection based on date
  useEffect(() => {
    selectReflection(dates.selectedDay, reflections);
  }, [reflections]);

  const getPrevDay = (): string => {
    // Calculate previous day
    const currentDate = new Date(dates.selectedDate);
    const prevDate = add(currentDate, { days: -1 });
    const prevDay = format(prevDate, EDateFormat.ddMM);
    // Update store
    dispatch(setSelectedDate(prevDate.getTime()));
    dispatch(setSelectedDay(prevDay));
    return prevDay;
  };

  const getNextDay = (): string => {
    // Calculate next day
    const currentDate = new Date(dates.selectedDate);
    const nextDate = add(currentDate, { days: 1 });
    const nextDay = format(nextDate, EDateFormat.ddMM);
    // Update store
    dispatch(setSelectedDate(nextDate.getTime()));
    dispatch(setSelectedDay(nextDay));
    return nextDay;
  };

  // Select the reflection from the data
  const selectReflection = (id: string, reflections: IReflection[]): void => {
    const currentReflection = reflections.find((reflection) => {
      return reflection.id === id;
    });
    // If a matching reflection is found - set with matched data
    if (currentReflection) {
      setReflection({
        id: currentReflection.id,
        date: currentReflection.date,
        title: currentReflection.title,
        quote: currentReflection.quote,
        source: currentReflection.source,
        reflection: verifyData(currentReflection.reflection)
      });
      // Set a blank reflection otherwise
    } else {
      setReflection({
        id: '-',
        date: '-',
        title: 'No data available',
        quote: '-',
        source: '-',
        reflection: '-'
      });
    }
  };

  // Verify if the data needs new lines inserted
  const verifyData = (data: string): string => {
    // Create pattern to find new line symbol {}
    const newLineSymbol = /\{(?<DATA>.*?)\}/gu;
    // Replace symbols with new lines
    const verifiedData = data.replace(newLineSymbol, '\n\n');
    return verifiedData;
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
    dispatch(setSelectedDate(currentDate));
    dispatch(setSelectedDay(currentDay));

    // Select reflection
    selectReflection(currentDay, reflections);
  };

  // Hide or show calendar
  const toggleCalendar = (): void => {
    setShowCalendar(!showCalendar);
  };

  return (
    <View>
      {/* Controls */}
      <View style={styles.controls}>
        {/* Left chevron */}
        <Pressable
          style={styles.icon}
          onPress={() => selectReflection(getPrevDay(), reflections)}>
          <FontAwesome
            name='chevron-circle-left'
            size={Control[deviceSize].icon}
            color={Colours[colorScheme].icon}
          />
        </Pressable>
        {/* Date */}
        <Pressable
          style={styles.dateContainer}
          onPress={() => toggleCalendar()}>
          {/* Calendar icon */}
          <FontAwesome5
            style={styles.calendarIcon}
            name='calendar-alt'
            size={Control[deviceSize].icon}
            color={Colours[colorScheme].icon}
          />
          <Text style={[styles.date, Control[deviceSize].subTitle]}>
            {reflection.date}
          </Text>
        </Pressable>
        {/* Right chevron */}
        <Pressable
          style={styles.icon}
          onPress={() => selectReflection(getNextDay(), reflections)}>
          <FontAwesome
            style={styles.textRight}
            name='chevron-circle-right'
            size={Control[deviceSize].icon}
            color={Colours[colorScheme].icon}
          />
        </Pressable>
      </View>
      {/* Components */}
      {showCalendar ? (
        <Calendar
          handleCalendarChange={updateReflection}
          handleScrollPosition={handleScrollPosition}
        />
      ) : (
        <View>
          {/* Reflection */}
          <Text style={[styles.displayTitle, Control[deviceSize].displayTitle]}>
            {reflection.title}
          </Text>
          <Text style={[styles.quote, Control[deviceSize].quote]}>
            {reflection.quote}
          </Text>
          <Text style={[styles.text, Control[deviceSize].text]}>
            {reflection.reflection}
          </Text>
          <ShareComponent />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  icon: {
    justifyContent: 'center',
    paddingVertical: 10,
    width: '25%'
  },
  calendarIcon: {
    paddingRight: 10
  },
  dateContainer: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  date: {
    textAlignVertical: 'center'
  },
  text: {
    textAlign: 'left'
  },
  textRight: {
    textAlign: 'right'
  },
  displayTitle: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 20,
    textAlign: 'center'
  },
  quote: {
    fontWeight: '200',
    marginBottom: 20,
    textAlign: 'left'
  }
});

export default Reflection;

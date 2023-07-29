import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';
import { IDate, IDayItem } from '../../types/date.types';

import { AppState } from '../../redux/store';
import { FontDisplay } from '../styles/StyledText';
import itemStates from '../../constants/itemStates';
import { useAppSelector } from '../../redux/hooks';
import useColorScheme from '../../hooks/useColorScheme';

const DayItem: React.FC<IDayItem> = (props: IDayItem): JSX.Element => {
  // Component settings
  const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
  const currentDayTheme = itemStates[`${colorScheme}CurrentItem`];

  // Data from store
  const dates: IDate = useAppSelector((state: AppState): IDate => {
    return state.date;
  });

  const combinedDay = (): boolean => {
    return dates.currentDay === props.id && dates.selectedDay === props.id;
  };

  // Styles for each day item
  const getDayTheme = (): {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
  } => {
    let currentBg: string = '#131324';
    if (combinedDay()) {
      console.log('combined day');
    } else if (dates.currentDay === props.id) {
      currentBg = '#067b84';
    } else if (dates.selectedDay === props.id) {
      currentBg = '#2c2cb9';
    }

    const dayTheme = {
      backgroundColor: currentBg,
      borderRadius: 8,
      paddingVertical: 8
    };

    return dayTheme;
  };

  return (
    <Pressable style={getDayTheme()} onPress={props.onPress}>
      {/* Day item */}
      <FontDisplay style={styles.text}>{props.name}</FontDisplay>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 8
  }
});

export default DayItem;

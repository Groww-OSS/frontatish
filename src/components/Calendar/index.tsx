import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import IonIcon from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
// eslint-disable-next-line import/no-unresolved
import { Button } from 'frontatish';
import Modal from 'react-native-modal';
import { useColors } from '../../themes';
import { CalendarProps } from './types';
import { Fonts } from '../../styles';

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 8,
  },
  TextStyle: {
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: -0.17,
    textAlign: 'center',
    marginTop: 20,
  },
  yearSelectedStyle: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 21,
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    paddingVertical: 10,
    // marginBottom: 4,
    marginRight: 10,
    color: '#44475B',
  },
  unselectedStyle: {
    height: 40,
    width: 40,
    fontFamily: Fonts.type.gotham_medium,
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    marginBottom: 4,
    marginRight: 10,
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  selectedStyle: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderStyle: 'solid',
    backgroundColor: '#00D09C',
    borderWidth: 1,
    borderColor: '#dfe1e4',
    fontFamily: Fonts.type.gotham_medium,
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    paddingVertical: 10,
    marginBottom: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
});

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const Calendar = (props: CalendarProps) => {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [refFlatList, setRefFlatList] = useState();
  // getting the suitable color based on the theme
  // activated inside the app
  const Colors = useColors();
  const {
    title,
    children,
    type,
    yearsArrayLowerBound,
    yearsArrayUpperBound,
    isOpen,
    onClosed,
    onConfirmClick,
    setDate,
    pickerKey,
  } = props;

  const changeMonth = (delta: number) => {
    const newTimeInMS = activeDate.setMonth(activeDate.getMonth() + delta);
    const updatedDate = new Date(newTimeInMS);
    setActiveDate(updatedDate);
  };
  const changeDay = (dateOfMonth: number) => {
    const newTimeInMS = activeDate.setMonth(activeDate.getMonth(), dateOfMonth);
    const updatedDate = new Date(newTimeInMS);
    setActiveDate(updatedDate);
  };
  setDate(activeDate);
  const yearsArray = [];
  for (
    let year = yearsArrayLowerBound;
    year <= yearsArrayUpperBound;
    year += 1
  ) {
    yearsArray.push(year);
  }

  const generateMatrix = () => {
    const matrix = [];
    // Create header
    matrix[0] = ['1', '2', '3', '4', '5', '6', '7'];
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();

    // const firstDay = new Date(year, month, 1).getDay();
    let maxDays = nDays[month];
    if (month === 1) {
      // February
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDays += 1;
      }
    }
    let counter = 8;
    for (let row = 1; row < 5; row += 1) {
      matrix[row] = [];
      for (let col = 0; col < 7; col += 1) {
        if (counter <= maxDays) {
          matrix[row][col] = counter.toString();
          counter += 1;
        } else {
          matrix[row][col] = '';
        }
      }
    }
    return matrix;
  };
  const matrix = generateMatrix();
  const renderEachRow = (daysArray: string[]) => {
    // console.log('dataArray', daysArray);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        {daysArray.map((item) => {
          return item === '' ? null : (
            <Ripple
              onPress={() => changeDay(parseInt(item, 10))}
              rippleContainerBorderRadius={18}
            >
              <View
                style={{
                  justifyContent: 'center',
                  borderRadius: 18,
                  height: 36,
                  width: 36,
                  backgroundColor:
                    activeDate.getDate().toString() === item
                      ? Colors.primary_attr_90
                      : Colors.white,
                }}
              >
                <Text
                  style={{
                    color: Colors.font_2,
                    textAlign: 'center',
                  }}
                >
                  {item}
                </Text>
              </View>
            </Ripple>
          );
        })}
      </View>
    );
  };
  const getItemLayout = (data: number[] | null | undefined, index: number) => {
    return { length: 70, offset: 70 * (index - 1), index };
  };
  switch (type) {
    case 'D/M/Y':
      return (
        <View
          style={[
            styles.calendarContainer,
            { backgroundColor: Colors.white, shadowColor: Colors.font_1 },
          ]}
        >
          <View style={{ marginVertical: 10 }}>
            <Text style={[styles.TextStyle, { color: Colors.font_1 }]}>
              {title}
            </Text>
          </View>
          <View
            style={{
              height: 40,
              backgroundColor: Colors.font_6,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 30,
                alignItems: 'center',
              }}
            >
              <Ripple
                style={{
                  height: 32,
                  width: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                rippleContainerBorderRadius={16}
                onPress={() => changeMonth(-1)}
              >
                <IonIcon
                  name="ios-arrow-back"
                  size={16}
                  color={Colors.primary}
                  // style={{ flex: 1, textAlign: 'center' }}
                />
              </Ripple>
              <Text
                style={{
                  color: Colors.primary,
                  flex: 2,
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: 16,
                }}
              >
                {months[activeDate.getMonth()]}
              </Text>
              <Ripple
                style={{
                  height: 32,
                  width: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                rippleContainerBorderRadius={16}
                onPress={() => changeMonth(1)}
              >
                <IonIcon
                  name="ios-arrow-forward"
                  size={16}
                  color={Colors.primary}
                  // style={{ flex: 1, textAlign: 'center' }}
                />
              </Ripple>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'flex-start', marginTop: 16 }}>
              {matrix.map((item) => renderEachRow(item))}
            </View>
          </View>
          {children}
        </View>
      );

    case 'M/Y':
      return (
        // <Modalbox
        //   style={{
        //     width: 302,
        //     height: null,
        //     borderRadius: 10,
        //     paddingHorizontal: 20,
        //     maxHeight: 320,
        //   }}
        //   isOpen={isOpen}
        //   // isDisabled={isDisabled}
        //   backdropPressToClose
        //   swipeToClose={false}
        //   position="center"
        //   entry="bottom"
        //   backdrop
        //   backdropOpacity={0.8}
        //   backdropColor="black"
        //   backdropContent={null}
        //   animationDuration={400}
        //   onClosed={onClosed}
        //   backButtonClose
        //   startOpen={false}
        //   coverScreen
        //   // keyboardTopOffset={22}
        // >
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            alignContent: 'center',
          }}
        >
          <Modal
            isVisible={isOpen}
            backdropOpacity={0.8}
            onBackdropPress={onClosed}
            animationOutTiming={500}
            onBackButtonPress={onClosed}
            onModalShow={() => {
              refFlatList.scrollToIndex({
                animated: true,
                index: selectedYear - yearsArrayLowerBound,
              });
            }}
            style={{
              width: 302,
              flex: -1,
              borderRadius: 10,
              paddingHorizontal: 20,

              backgroundColor: 'white',
              alignSelf: 'center',
            }}
          >
            <View>
              <Text style={styles.TextStyle}>Select a year & month</Text>
              <FlatList
                data={yearsArray}
                renderItem={({ item, index }) => (
                  <Text
                    key={index}
                    style={
                      selectedYear === item
                        ? [
                            styles.yearSelectedStyle,
                            { marginBottom: 0, flex: 1 },
                          ]
                        : [
                            styles.unselectedStyle,
                            {
                              marginBottom: 0,
                              flex: 1,
                              width: 60,
                              alignSelf: 'center',
                            },
                          ]
                    }
                    onPress={() => setSelectedYear(item)}
                  >
                    {item}
                  </Text>
                )}
                getItemLayout={getItemLayout}
                keyExtractor={(item) => item.toString()}
                horizontal
                style={{
                  marginHorizontal: 30,
                }}
                ref={(ref) => setRefFlatList(ref)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  paddingHorizontal: 25,
                }}
              >
                {months.map((item, index) => {
                  return (
                    <Text
                      onPress={() => setSelectedMonth(index)}
                      style={
                        months[selectedMonth] === item
                          ? [styles.selectedStyle]
                          : [styles.unselectedStyle]
                      }
                    >
                      {item.substr(0, 3)}
                    </Text>
                  );
                })}
              </View>
              <Button
                label="Done"
                customStyles={{ margin: 12 }}
                onPress={() =>
                  onConfirmClick({
                    key: pickerKey,
                    value: { year: selectedYear, month: selectedMonth },
                  })
                }
              />
            </View>
          </Modal>
        </View>
      );
    default:
      return (
        <View>
          <Text>Day Picker</Text>
        </View>
      );
  }
};

Calendar.defaultProps = {
  title: 'Select Date:',
  type: 'D/M/Y',
  yearsArrayLowerBound: 2016,
  yearsArrayUpperBound: new Date().getFullYear(),
  isOpen: false,
  onClosed: () => {},
  onConfirmClick: () => {},
  pickerKey: {},
  setDate: () => {},
};

export default Calendar;

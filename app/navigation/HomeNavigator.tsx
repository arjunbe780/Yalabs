import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../config/colors';
import Dashboard from '../screens/Dashboard';
import { IconButton } from 'react-native-paper';
import AudioRecorder from '../screens/AudioRecorder';

const Tab = createBottomTabNavigator();

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const MyTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 72 : 64,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={1}
            style={styles.tabBar}
          >
            <View style={styles.bottomTab}>
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.backgroundColor1 : '#D6D6D6',
                  size: 22,
                })}
              <Text
                style={{
                  fontSize: 12,
                  color: isFocused ? colors.backgroundColor1 : '#D6D6D6',
                }}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="dashboardTab"
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarShowLabel: true,
      }}
      tabBar={props => <MyTabBar {...props} />}
      backBehavior="initialRoute"
    >
      <Tab.Screen
        name="dashboardTab"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconButton
              icon="view-dashboard"
              size={size}
              style={styles.icon}
              iconColor={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="audioRecorderTab"
        component={AudioRecorder}
        options={{
          headerShown: false,
          tabBarLabel: 'Audio Recorder',
          tabBarIcon: ({ color, size }) => (
            <IconButton
              icon="record-rec"
              size={size}
              style={styles.icon}
              iconColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.primaryBackgroundColor,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor1,
  },
  tabBar: {
    flex: 1,
    backgroundColor: colors.primaryBackgroundColor,
  },
  icon: {
    margin: 0,
  },
});

export default HomeNavigator;

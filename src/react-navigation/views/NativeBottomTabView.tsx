import type {
  ParamListBase,
  TabNavigationState,
  Route,
} from '@react-navigation/native';
import type {
  NativeBottomTabDescriptorMap,
  NativeBottomTabNavigationConfig,
  NativeBottomTabNavigationHelpers,
} from '../types';
import TabView from '../../TabView';

type Props = NativeBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: NativeBottomTabNavigationHelpers;
  descriptors: NativeBottomTabDescriptorMap;
};

export default function NativeBottomTabView({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  return (
    <TabView
      {...rest}
      navigationState={state}
      renderScene={({ route }) => descriptors[route.key]?.render()}
      getLabelText={({ route }) => {
        const options = descriptors[route.key]?.options;

        return options?.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options?.title !== undefined
            ? options.title
            : (route as Route<string>).name;
      }}
      getBadge={({ route }) => descriptors[route.key]?.options.tabBarBadge}
      getIcon={({ route, focused }) => {
        const options = descriptors[route.key]?.options;

        if (options?.tabBarIcon) {
          const { tabBarIcon } = options;
          return tabBarIcon({ focused });
        }

        return null;
      }}
      getLazy={({ route }) => descriptors[route.key]?.options.lazy ?? true}
      onIndexChange={(index) => {
        const route = state.routes[index];
        if (!route) {
          return;
        }

        navigation.emit({
          type: 'tabPress',
          target: route.key,
        });
        navigation.navigate({ key: route.key, merge: true });
      }}
    />
  );
}
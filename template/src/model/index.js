import React from 'react';
import { useObserver } from 'mobx-react';
import { AuthStore, namespace as auth } from './auth';

// Mobx class
class RootStore {
  [auth] = new AuthStore(this);

  // TODO: add your mobx module ...
}

// Native context
export const storesContext = React.createContext({
  rootStore: new RootStore(),
});

// For Hooks component
export const useStores = () => React.useContext(storesContext);

// For Class component
export function inject(selector, BaseComponent) {
  const HOComponent = (ownProps = {}) => {
    const { rootStore } = React.useContext(storesContext);
    const props = { ...selector(rootStore), ...ownProps };
    return useObserver(() => <BaseComponent {...props} />);
  };
  HOComponent.displayName = BaseComponent.name;
  return HOComponent;
}

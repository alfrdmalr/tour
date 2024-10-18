import * as React from 'react';
import { createRoot } from 'react-dom/client';

//import { Walktour, WalktourLogic } from 'walktour'; // test with npm pack
import { Walktour, WalktourLogic } from '../src/components/Walktour';
import { playgroundSetup, primaryIntoSecondary, secondarySteps } from './setup';

const App = () => {
  const [tourOpen, setTourOpen] = React.useState<boolean>(true);

  return (
    <>
      {playgroundSetup({
        buttonText: 'Toggle Tour',
        onButtonClick: () => setTourOpen(!tourOpen),
      })}
      <Walktour
        steps={secondarySteps()}
        identifier={'2'}
        rootSelector={'#demo-container'}
      />
      <Walktour
        steps={primaryIntoSecondary()}
        identifier={'1'}
        isOpen={tourOpen}
        customCloseFunc={(logic: WalktourLogic) => {
          setTourOpen(false);
          logic.close();
        }}
        disableCloseOnClick
      />
    </>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);

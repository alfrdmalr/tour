import * as React from 'react';
import { defaultStyles, WalktourStyles } from './defaultstyles';
import { Coords, getElementCoords, getTooltipPosition, CardinalOrientation } from './positioning'


export interface WalktourLogic {
  next: () => void;
  prev: () => void;
  close: () => void;
  goToStep: (stepNumber: number) => void;
  stepContent: Step;
}

export interface WalktourOptions {
  disableMaskInteraction?: boolean;
  orientationPreferences?: CardinalOrientation[];
  maskPadding?: number;
  tooltipSeparation?: number;
  tooltipWidth?: number;
  transition?: string;
  customTooltipRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  styles?: WalktourStyles;
}

export interface Step extends WalktourOptions {
  querySelector: string;
  title: string;
  description: string;
  customTitleRenderer?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRenderer?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
}

export interface WalktourProps extends WalktourOptions {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
}

const walktourDefaultProps: Partial<WalktourProps> = {
  prevLabel: 'prev',
  nextLabel: 'next',
  skipLabel: 'skip',
  styles: defaultStyles,
  tooltipWidth: 250,
  maskPadding: 5,
  tooltipSeparation: 10,
  transition: 'top 200ms ease, left 200ms ease',
  disableMaskInteraction: false
}

export const Walktour = (props: WalktourProps) => {

  const {
    isVisible,
    steps,
    initialStepIndex
  } = props;

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [targetData, setTargetData] = React.useState<ClientRect>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const currentStepContent = getStep(currentStepIndex, steps);

  const {
    prevLabel,
    nextLabel,
    skipLabel,
    styles,
    maskPadding,
    disableMaskInteraction,
    tooltipSeparation,
    tooltipWidth,
    transition,
    orientationPreferences,
    customTooltipRenderer,
    customTitleRenderer, 
    customDescriptionRenderer,
    customFooterRenderer,
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  React.useEffect(() => {
    goToStep(currentStepIndex)
  }, []);

  React.useEffect(() => {
    if (isVisibleState === false) {
      return;
    }
    const tooltip: HTMLElement = document.getElementById('walktour-tooltip');
    const tooltipData: ClientRect = tooltip && tooltip.getBoundingClientRect();
    const targetData = getTargetData(getStep(currentStepIndex, steps).querySelector);

    setTargetData(targetData);
    setTooltipPosition(getTooltipPosition({
      target: targetData,
      tooltip: tooltipData,
      padding: maskPadding,
      tooltipSeparation: tooltipSeparation,
      orientationPreferences: orientationPreferences
    }));

    tooltip && tooltip.focus();

  }, [currentStepIndex])

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    setCurrentStepIndex(stepIndex);
  }

  const next = () => {
    goToStep(currentStepIndex + 1);
  }

  const prev = () => {
    goToStep(currentStepIndex - 1);
  }

  const skip = () => {
    goToStep(0);
    setVisible(false);
  }

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        skip();
        event.preventDefault();
        break;
      case "ArrowRight":
        next();
        event.preventDefault();
        break;
      case "ArrowLeft":
        prev();
        event.preventDefault();
        break;
    }
  }

  if (!isVisibleState) {
    return null
  };

  const tourLogic: WalktourLogic = {
    next: next,
    prev: prev,
    close: skip,
    goToStep: goToStep,
    stepContent: currentStepContent
  };

  //style attributes for positioning
  const tooltipStyle: React.CSSProperties = {
    ...(customTooltipRenderer ? null : styles.container),
    position: 'absolute',
    width: tooltipWidth,
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    transition: transition,
    visibility: tooltipPosition ? 'visible' : 'hidden'
  }

  return (<>
    {TourMask(targetData, disableMaskInteraction, maskPadding)}
      <div id="walktour-tooltip" style={tooltipStyle} onKeyDown={keyPressHandler} tabIndex={0}>
        {customTooltipRenderer && customTooltipRenderer(tourLogic)}
        {!customTooltipRenderer &&
          <>
            {customTitleRenderer
              ? customTitleRenderer(currentStepContent.title, tourLogic)
              : (
                <div style={styles.title}>
                  {currentStepContent.title}
                </div>
              )
            }

            {customDescriptionRenderer
              ? customDescriptionRenderer(currentStepContent.description, tourLogic)
              : (
                <div style={styles.description}>
                  {currentStepContent.description}
                </div>
              )
            }

            {customFooterRenderer
              ? currentStepContent.customFooterRenderer(tourLogic)
              : (
                <div style={styles.footer}>
                  <button onClick={skip} style={styles.tertiaryButton}>
                    {skipLabel}
                  </button>
                  <button
                    onClick={prev}
                    disabled={currentStepIndex === 0}
                    style={currentStepIndex !== 0 ? styles.secondaryButton : styles.disabledButton}
                  >
                    {prevLabel}
                  </button>
                  <button
                    onClick={next}
                    disabled={currentStepIndex + 1 === steps.length}
                    style={currentStepIndex + 1 !== steps.length ? styles.primaryButton : styles.disabledButton}
                  >
                    {nextLabel}
                  </button>
                </div>
              )}
          </>
        }
      </div>
  </>)
}

function getStep(stepIndex: number, steps: Step[]) {
  return steps[stepIndex]
}

function getTargetData(selector: string): ClientRect {
  const element = document.querySelector(selector)
  const targetData = element && element.getBoundingClientRect();

  if (targetData) {
    return targetData
  } else {
    throw new Error(`element specified by  "${selector}" could not be found`);
  }
}

function TourMask(target: ClientRect, disableMaskInteraction: boolean, padding: number = 0, roundedCutout: boolean = true): JSX.Element {
  if (!target) {
    return null;
  }
  const coords: Coords = getElementCoords(target, true);
  return (
    <div
      style={{
        position: 'absolute',
        top: coords.y - padding,
        left: coords.x - padding,
        height: target.height + (padding * 2),
        width: target.width + (padding * 2),
        boxShadow: '0 0 0 9999px rgb(0,0,0,0.6)',
        borderRadius: roundedCutout ? '5px' : 0,
        pointerEvents: disableMaskInteraction ? 'auto' : 'none'
      }}
    >
    </div>
  );
}



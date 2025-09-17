import React, { FunctionComponent, useRef, useState } from 'react';
import { Teacher } from '_/shared/services/schedule-service/types';
import { makeStyles } from 'tss-react/mui';
import log from 'electron-log';

const logger = log.scope('ConferenceWindow/UserSelect');

interface Props {
  data: Teacher[];
  onValueChange?(value: unknown): void;
}

const useStyles = makeStyles()(() => ({
  combobox: {
    display: 'block',
    width: '300px',
    height: '40px',
    position: 'relative',
    margin: '10px 0',
    '&:after': {
      display: 'block',
      width: '12px',
      height: '12px',
      content: '""',
      position: 'absolute',
      borderRight: '1px solid rgba(0, 0, 0, 0.5)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
      top: '50%',
      right: '16px',
      pointerEvents: 'none',
      transform: 'translate(0, -65%) rotate(45deg)',
    },
  },
  combo_input: {
    backgroundColor: '#f5f5f5',
    display: 'block',
    width: '100%',
    padding: '8.5px 14px',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    fontSize: '1rem',
    textAlign: 'left',
    '&:focus': {
      border: '2px solid #03093f',
      outline: '2.5px solid transparent',
    },
  },
  combo_menu: {
    backgroundColor: '#f5f5f5',
    display: 'none',
    width: '300px',
    maxHeight: '300px',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    boxShadow:
      '0px 5px 5px -3px rgba(0, 0, 0, 0.20), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    overflowY: 'auto',
    position: 'fixed',
    top: '255px',
    zIndex: 100,
  },
  open_list: {
    display: 'block',
  },
  combo_option: {
    display: 'flex',
    height: '48px',
    padding: '6px 16px',
    fontSize: '16px',
    fontWeight: 400,
    textAlign: 'left',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  option_current: {
    backgroundColor: 'rgba(0, 0, 0, 0.1);',
  },
}));

const Keys = {
  Backspace: 'Backspace',
  Clear: 'Clear',
  Down: 'ArrowDown',
  End: 'End',
  Enter: 'Enter',
  Escape: 'Escape',
  Home: 'Home',
  Left: 'ArrowLeft',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Right: 'ArrowRight',
  Space: ' ',
  Tab: 'Tab',
  Up: 'ArrowUp',
};

const MenuActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9,
};

export const UserSelect: FunctionComponent<Props> = ({ data, onValueChange }) => {
  const { classes } = useStyles();
  const [teachers, setTeachers] = useState<Teacher[]>(data);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const selectReference = useRef<HTMLDivElement>(null);

  const filterOptions = (value: string, exclude: Teacher[] = []) => {
    return data.filter((option) => {
      logger.info(`Filter meet teachers by ${value}`);
      const filter = option.name.toLowerCase().indexOf(value.toLowerCase()) === 0;
      return filter && exclude.indexOf(option) < 0;
    });
  };

  const getActionFromKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    logger.info('Get action from key');
    const { key, altKey, ctrlKey, metaKey } = event;
    logger.info(`Was pressed ${key}. AltKey: ${altKey}. CtrlKey: ${ctrlKey}. MetaKey: ${metaKey}`);
    if (!isOpen && (key === Keys.Down || key === Keys.Enter || key === Keys.Space)) {
      logger.info(`Menu action ${MenuActions.Open}`);
      return MenuActions.Open;
    }
    switch (key) {
      case Keys.Down:
        logger.info(`Menu action next`);
        return MenuActions.Next;
      case Keys.Up:
        logger.info(`Menu action previous`);
        return MenuActions.Previous;
      case Keys.Home:
        logger.info(`Menu action first`);
        return MenuActions.First;
      case Keys.End:
        logger.info(`Menu action last`);
        return MenuActions.Last;
      case Keys.Escape:
        logger.info(`Menu action close`);
        return MenuActions.Close;
      case Keys.Enter:
        logger.info(`Menu action close select`);
        return MenuActions.CloseSelect;
      case Keys.Space:
        logger.info(`Menu action space`);
        return MenuActions.Space;
      case Keys.Backspace || key === Keys.Clear || (key.length === 1 && !altKey && !ctrlKey && !metaKey):
        logger.info(`Menu action type`);
        return MenuActions.Type;
      default:
        logger.info(`Default menu action type`);
        return MenuActions.Type;
    }
  };

  const onInputChange = (value: string) => {
    setInputValue(value);
    const filter = filterOptions(value);
    setTeachers(filter);
  };

  const onInputBlur = () => {};

  const getUpdatedIndex = (action: number) => {
    logger.info('Get updated index');
    switch (action) {
      case MenuActions.First:
        logger.info(`Menu action first`);
        return 0;
      case MenuActions.Last:
        logger.info(`Menu action last`);
        return teachers.length - 1;
      case MenuActions.Previous:
        logger.info(`Menu action previous`);
        return Math.max(0, activeIndex - 1);
      case MenuActions.Next:
        logger.info(`Menu action next`);
        return Math.min(teachers.length - 1, activeIndex + 1);
      default:
        logger.info(`Default value`);
        return activeIndex;
    }
  };

  const updateMenuState = (open: boolean) => {
    if (inputValue === '' || !open) {
      logger.info('Update menu state. Set teacher.');
      setTeachers(data);
    }
    setOpen(open);
  };

  const onOptionChange = (index: number) => {
    logger.info('Option changed.');
    selectReference.current?.focus();
    setActiveIndex(index);
  };

  const selectOption = (index: number) => {
    onOptionChange(index);
    setInputValue(teachers[index].name);
    updateMenuState(false);
    if (onValueChange) onValueChange(teachers[index]);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const action = getActionFromKey(event);
    switch (action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return onOptionChange(getUpdatedIndex(action));
      case MenuActions.CloseSelect:
        event.preventDefault();
        selectOption(activeIndex);
        return updateMenuState(false);
      case MenuActions.Close:
        event.preventDefault();
        return updateMenuState(false);
      case MenuActions.Open:
        return updateMenuState(true);
      default:
        break;
    }
  };

  return (
    <div className={classes.combobox}>
      <input
        id='teacher'
        aria-activedescendant={activeIndex.toString()}
        aria-autocomplete='none'
        aria-controls='listbox'
        type='text'
        className={classes.combo_input}
        onBlur={onInputBlur}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onInputKeyDown}
        onClick={() => updateMenuState(true)}
        value={inputValue}
      />
      <div id='teachers' role='listbox' className={`${classes.combo_menu} ${isOpen ? classes.open_list : ''}`}>
        {teachers.map((teacher: Teacher, index: number) => (
          <div
            key={teacher.id}
            role='option'
            tabIndex={index}
            aria-selected={index === 0}
            className={`${classes.combo_option} ${index === activeIndex ? classes.option_current : ''}`}
            onKeyDown={onInputKeyDown}
            onClick={() => selectOption(index)}
            ref={index === activeIndex ? selectReference : null}
          >
            {teacher.name}
          </div>
        ))}
      </div>
    </div>
  );
};

UserSelect.defaultProps = {
  onValueChange: undefined,
};

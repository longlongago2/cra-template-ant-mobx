import React from 'react';
import PropTypes from 'prop-types';
import { ButtonAuthority } from '@/router/PrivateRoute';

export default function PrivateButton(props) {
  const { buttonKey, children } = props;
  return (
    <ButtonAuthority.Consumer>
      {(value) => {
        const haskey = value.filter((item) => item.key === buttonKey).length > 0;
        if (haskey) return children;
        return null;
      }}
    </ButtonAuthority.Consumer>
  );
}

PrivateButton.propTypes = {
  buttonKey: PropTypes.any.isRequired,
  children: PropTypes.any,
};

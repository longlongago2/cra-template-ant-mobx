import React from 'react';
import PropTypes from 'prop-types';
import { AuthorityContext } from '@/components/RouterConfig';

/**
 * @description 权限按钮组件
 * @export
 * @param {object} props
 * @param {string | number} props.buttonKey 按钮唯一标识
 * @param {*} props.children 子组件：真正的按钮
 * @return {*}
 */
export default function PrivateButton(props) {
  const { buttonKey, children } = props;
  return (
    <AuthorityContext.Consumer>
      {({ buttons }) => {
        if (!Array.isArray(buttons)) return null;
        const haskey = buttons.filter((item) => item.key === buttonKey).length > 0;
        if (haskey) return children;
        return null;
      }}
    </AuthorityContext.Consumer>
  );
}

PrivateButton.propTypes = {
  buttonKey: PropTypes.any.isRequired,
  children: PropTypes.any,
};

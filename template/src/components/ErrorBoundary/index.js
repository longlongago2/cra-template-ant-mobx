import { Component } from 'react';
import PropTypes from 'prop-types';
import { Result, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Paragraph, Text } = Typography;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: [],
    };
  }

  static propTypes = {
    children: PropTypes.element,
  };

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo: [
        { title: 'TypeError', message: error.message },
        { title: 'ComponentStack', message: errorInfo.componentStack },
      ],
    });
  }

  render() {
    const { hasError, errorInfo } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Result status="error" title="错误警告" subTitle="渲染期间发生错误，请尽快报告开发者处理！">
          <div className={styles.desc}>
            <Paragraph>
              <Text strong className={styles.title}>
                The following error occurred during rendering:
              </Text>
            </Paragraph>
            {errorInfo.map((item) => (
              <Paragraph>
                <CloseCircleOutlined className={styles.icon} />
                <Text mark className={styles.rowTitle}>
                  {item.title}：
                </Text>
                <Text>{item.message}</Text>
              </Paragraph>
            ))}
          </div>
        </Result>
      );
    }
    return children;
  }
}

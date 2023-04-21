import React from 'react';
import { Select } from 'antd';
import { baseHost, HOST_API_MAP, HOST_MAP } from '@/utils/api/path';

const { Option } = Select;

export const HostSelect = () => {
  // const [, updateState] = useState();
  // const forceUpdate = useCallback(() => updateState({}), [])
  const hostHandle = value => {
    if (value) {
      sessionStorage.setItem('host', value);
      // forceUpdate()
      window.location.reload();
    }
  };
  const sessionHost = sessionStorage.getItem('host');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: 'red',
          fontSize: 18,
        }}
      >
        {`转发网关: ${sessionHost ||
          baseHost ||
          HOST_API_MAP[location.host]}     切换网关:   `}
      </div>
      <Select
        style={{
          width: 300,
        }}
        onChange={hostHandle}
        defaultValue={sessionHost || baseHost || HOST_API_MAP[location.host]}
      >
        {Array.from(new Set(Object.values(HOST_MAP || {}))).map(item => (
          <Option
            key={item}
            value={item}
            disabled={[
              '//gw-wj.xiaojukeji.com',
              '//gw-wj.intra.xiaojukeji.com',
              '//gw-wj.chengxinyouxuan.com',
            ].includes(item)}
          >
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
};

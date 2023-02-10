# Node/system告警规则

基于Node Exporter的监控指标设计的告警规则。   

**配置文件**: &nbsp;&nbsp;&nbsp;&nbsp; [GitHub](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules_zh.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules_zh.yml)&nbsp;&nbsp;&nbsp;&nbsp; [GitHub(英文版本)](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee(英文版本)](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml)

```Zh
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/NodeExporterRules_zh.yml
```
```En
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/NodeExporterRules.yml
```

## ◆ 节点CPU上下文切换高  
**描述**
当平均每个CPU内核的上下文切换数量高时发出警报。
此阈值与环境运行的应用程序有关。
请在使用时根据操作系统运行情况操作进行调整。

**指标**   
- "node_context_switches_total": 节点上下文切换的总数  
  
**告警规则**   
```
    - alert: NodeContextSwitchingHigh
      expr: rate(node_context_switches_total[5m])/count without(mode,cpu) (node_cpu_seconds_total{mode="idle"}) > 2000
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点CPU上下文切换高 (Instance:{{ $labels.instance }})
        description: "5分钟内平均每核心的上下文切换数超过,value: {{ $labels.value }}"
```
```En
    - alert: NodeContextSwitchingHigh
      expr: rate(node_context_switches_total[5m])/count without(mode,cpu) (node_cpu_seconds_total{mode="idle"}) > 2000
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node context switching high (Instance:{{ $labels.instance }})
        description: "Cpu core context switching rate more than 2000 within 5 minutes,value: {{ $labels.value }}"
```

## ◆ 节点CPU负载高  
**描述**
当CPU核心的负载高时，产生告警。
这个指标是每个CPU Core的负载而不是CPU Core的负载的平均值。 

**指标**   
- "node_cpu_seconds_total{mode="idle"}": CPU在"idle"模式消耗的时间，单位为秒。  
  
**告警规则**   
```
    - alert: NodeCpuLoadHigh
      expr: 100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100 > 70
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点CPU负载高 (Instance:{{ $labels.instance }})
        description: "5分钟内CPU负载超过70%,value: {{ $labels.value }}%"
```
```En
  - alert: NodeCpuLoadHigh
      expr: 100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100 > 70
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node cpu load high (Instance:{{ $labels.instance }})
        description: "Node cpu load more than 70% within 5 minutes,value: {{ $labels.value }}%"
```

## ◆ 节点CPUIowait高  
**描述**
当CPU核心的IOwait高时产生告警。    
这个指标是每个CPU Core的iowait而不是CPU Core的iowait平均值。 
高IOWait可能意味着硬盘读写忙碌或网络传输忙碌。

**指标**   
- "node_cpu_seconds_total{mode="iowait"}": CPU在"iowait"模式消耗的时间，单位为秒。   
  
**告警规则**   
```
    - alert: NodeCpuIowaitHigh
      expr: rate(node_cpu_seconds_total{mode="iowait"}[5m])*100 > 5
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点CPU iowait高 (Instance:{{ $labels.instance }})
        description: "5分钟内节点CPU(core:{{ $labels.cpu }}) iowait 超过5%,value: {{ $labels.value }}%"
```
```En
    - alert: NodeCpuIowaitHigh
      expr: rate(node_cpu_seconds_total{mode="iowait"}[5m])*100 > 5
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node cpu iowait high (Instance:{{ $labels.instance }})
        description: "Node cpu core(core:{{ $labels.cpu }}) iowait more than 5% within 5 minutes,value: {{ $labels.value }}%"
```
## ◆ 节点硬盘丢失  
**描述**
当节点上的硬盘数量低于设定的阈值时告警.
此警报规则通常用于具有多个硬盘（如分布式存储群集）的场景。
使用时请修改告警阈值

**指标**   
- "node_disk_io_now": 当前的I/O数，此指标用于计算硬盘数量。
  
**告警规则**   
```
    - alert: NodeDisksMissing
      expr: count without(device) (node_disk_io_now{device=~"sd.*"}) < 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点硬盘丢失 (Instance:{{ $labels.instance }})
        description: "节点上的硬盘数小于 1，value: {{ $labels.value }}"
``` 
```
    - alert: NodeDisksMissing
      expr: count without(device) (node_disk_io_now{device=~"sd.*"}) < 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node disks missing (Instance:{{ $labels.instance }})
        description: "The number of hard disks is less than 1，value: {{ $labels.value }}"
```

## ◆ 节点硬盘I/O高 
**描述**
当节点上的硬盘当前的I/O高时告警。
硬盘的I/O性能与硬盘材质、Raid、读写的数据块大小、数据稀疏情况等有关，请根据实际情况修改阈值。

**指标**   
- "node_disk_io_now": 当前的I/O数
  
**告警规则**   
```
    - alert: NodeDisksIOHigh
      expr: node_disk_io_now > 50
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 硬盘 I/O 高(Instance:{{ $labels.instance }})
        description: "持续5分钟硬盘({{ $labels.device }})实时IO超过50,value:{{ $labels.value }}"
```
```En
    - alert: NodeDisksIOHigh
      expr: node_disk_io_now > 50
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node disks I/O High(Instance:{{ $labels.instance }})
        description: "The disk I/O of device({{ $labels.device }}) exceeds 50 within 5 minutes,value:{{ $labels.value }}"
```

## ◆ 节点硬盘读速率高  
**指标**   
- "node_disk_read_bytes_total":  硬盘读数据量的总数，单位为"byte"
  
**告警规则**   
```
    - alert: NodeDiskReadRateHigh
      expr: rate(node_disk_read_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 硬盘读速率高 (Instance:{{ $labels.instance }})
        description: "5分钟内硬盘({{ $labels.device }})读速率超过50MB/s,value:{{ $labels.value }}MB/s"
``` 
```En
    - alert: NodeDiskReadRateHigh
      expr: rate(node_disk_read_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node disk read rate high (Instance:{{ $labels.instance }})
        description: "The read rate of disk({{ $labels.device }}) exceeds 50MB/s within 5 minutes,value:{{ $labels.value }}MB/s"
``` 

## ◆ 节点硬盘写速率高  
**指标**   
- "node_disk_written_bytes_total":  硬盘写数据量的总数，单位为"byte"
  
**告警规则**   
```
    - alert: NodeDiskWrittenRateHigh
      expr: rate(node_disk_written_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 硬盘写速率高 (Instance:{{ $labels.instance }})
        description: "5分钟内硬盘({{ $labels.device }})写速率超过50MB/s,value:{{ $labels.value }}MB/s"
``` 
```En
    - alert: NodeDiskWrittenRateHigh
      expr: rate(node_disk_written_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node disk written rate high (Instance:{{ $labels.instance }})
        description: "The written rate of disk({{ $labels.device }}) exceeds 50MB/s within 5 minutes,value:{{ $labels.value }}MB/s"
``` 

## ◆ 节点文件系统使用率高  
**指标**   
- "node_filesystem_size_bytes": 文件系统大小，单位为byte.
- "node_filesystem_free_bytes": 文件系统剩余空间，单位为byte.
  
**告警规则**   
```
    - alert: NodeFilesystemFull
      expr: 100 - node_filesystem_free_bytes{mountpoint!~"/boot.*|/run.*"}/node_filesystem_size_bytes*100 > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 文件系统使用率高 (Instance:{{ $labels.instance }})
        description: "文件系统(mountpoint:{{ $labels.mountpoint }})使用率超过80%，value: {{ $labels.value }}%"
```
```
    - alert: NodeFilesystemFull
      expr: 100 - node_filesystem_free_bytes{mountpoint!~"/boot.*|/run.*"}/node_filesystem_size_bytes*100 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node filesystem full (Instance:{{ $labels.instance }})
        description: "The used space of the filesystem(mountpoint:{{ $labels.mountpoint }}) is more than 80%，value: {{ $labels.value }}%"
```

## ◆ 节点文件系统即将写满 
**描述**
当预测文件系统即将写满时产生告警
**指标**   
- "node_filesystem_size_bytes": 文件系统大小，单位为byte.
- "node_filesystem_free_bytes": 文件系统剩余空间，单位为byte.
  
**告警规则**   
```
    - alert: NodeFilesystemWillFull
      expr: 100 - predict_linear(node_filesystem_free_bytes[24h], 7*24*3600)/node_filesystem_size_bytes*100 > 100
      for: 0m
      labels:
        severity: info
      annotations:
        summary: 文件系统即将写满 (Instance:{{ $labels.instance }})
        description: "预测7天内文件系统(mountpoint:{{ $labels.mountpoint }})将写满，value: {{ $labels.value }}%"
```
```En
    - alert: NodeFilesystemWillFull
      expr: 100 - predict_linear(node_filesystem_free_bytes[24h], 7*24*3600)/node_filesystem_size_bytes*100 > 100
      for: 0m
      labels:
        severity: info
      annotations:
        summary: Node filesystem will full (Instance:{{ $labels.instance }})
        description: "The filesystem(mountpoint:{{ $labels.mountpoint }}) is predicted to be full within 7 days，value: {{ $labels.value }}%"
```

## ◆ 文件系统只读状态 
**指标**   
- "node_filesystem_readonly": 文件系统只读状态
  
**告警规则**   
```
    - alert: NodeFilesystemReadonly
      expr: node_filesystem_readonly != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: 文件系统只读状态 (Instance:{{ $labels.instance }})
        description: "文件系统(mountpoint:{{ $labels.mountpoint }})只读状态"
```
```En
    - alert: NodeFilesystemReadonly
      expr: node_filesystem_readonly != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Node filesystem readonly (Instance:{{ $labels.instance }})
        description: "The filesystem(mountpoint:{{ $labels.mountpoint }}) is readonly"
```

## ◆ 节点设备获取信息错误 
**指标**   
- "node_filesystem_device_error": 获取设备的统计信息时是否发生错误。
  
**告警规则**   
```
    - alert: NodeFilesystemDeviceError
      expr: node_filesystem_device_error != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: 获取设备的统计信息时发生错误(Instance:{{ $labels.instance }})
        description: "获取设备({{ $labels.mountpoint }})的统计信息时发生错误"
```
```En
    - alert: NodeFilesystemDeviceError
      expr: node_filesystem_device_error != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Node filesystem Device Error (Instance:{{ $labels.instance }})
        description: "An error occurred while getting statistics for device({{ $labels.mountpoint }})"
```

## ◆ 节点Inode使用率高  
**指标**   
- "node_filesystem_files": 文件系统Inode总数
- "node_filesystem_files_free":  文件系统剩余Inode数量
  
**告警规则**   
```
    - alert: NodeInodeUsageHigh
      expr: 100 - node_filesystem_files_free/node_filesystem_files*100 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点Inode使用率高(Instance:{{ $labels.instance }})
        description: "节点(filesystem:{{ $labels.mountpoint }}) Inode使用率超过 80%，value: {{ $labels.value }}%"
```
```
    - alert: NodeInodeUsageHigh
      expr: 100 - node_filesystem_files_free/node_filesystem_files*100 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node inode usage high (Instance:{{ $labels.instance }})
        description: "The used file nodes(inodes) of the filesystem(filesystem:{{ $labels.mountpoint }}) is more than 80%，value: {{ $labels.value }}%"
```

## ◆ 节点内存使用率高
**指标**   
- "node_memory_MemAvailable_bytes": 节点内存可用容量，单位为byte.
- "node_memory_MemTotal_bytes": 节点内存总容量，单位为byte.
  
**告警规则**   
```
    - alert: NodeMemoryUsageHigh
      expr: 100- node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 节点内存使用率高 (Instance:{{ $labels.instance }})
        description: "节点持续5分钟内存使用率超过70%，value:{{ $labels.value }}%"
```  
```En
    - alert: NodeMemoryUsageHigh
      expr: 100- node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node memory usage high (Instance:{{ $labels.instance }})
        description: "Node memory usage more than 70% within 5 minutus，value:{{ $labels.value }}%"
```    

## ◆ 节点交换内存使用率高  
**指标**   
- "node_memory_SwapFree_bytes": 节点交换内存可用容量，单位为byte.
- "node_memory_SwapTotal_bytes": 节点交换内存总容量，单位为byte.
  
**告警规则**   
```
    - alert: NodeSwapMemoryUsageHigh
      expr: 100 - node_memory_SwapFree_bytes/node_memory_SwapTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 节点交换内存使用率高 (Instance:{{ $labels.instance }})
        description: "节点持续5分钟交换内存使用率超过70%，value:{{ $labels.value }}%"
```   
```
    - alert: NodeSwapMemoryUsageHigh
      expr: 100 - node_memory_SwapFree_bytes/node_memory_SwapTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node out of swap memory (Instance:{{ $labels.instance }})
        description: "Node swap memory usage more than 70% within 5 minutus，value:{{ $labels.value }}%"
```   
## ◆ 节点网络设备发送包错误  
**指标**   
- "node_network_transmit_errs_total": 节点网络设备发送的错误包数量.
  
**告警规则**   
```
    - alert: NodeNetworkTransmitErr
      expr: rate(node_network_transmit_errs_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网络设备发送包错误 (Instance:{{ $labels.instance }})
        description: "5分钟内网络设备({{ $labels.device }})大约{{ printf \"%.0f\" $labels.value }}个发送包错误"
```
```En
    - alert: NodeNetworkTransmitErr
      expr: rate(node_network_transmit_errs_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network transmit_errs (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{ printf \"%.0f\" $labels.value }} transmit_errs within 5 minutus"
```    

## ◆ 节点网络设备发送丢包  
**指标**   
- "node_network_transmit_drop_total": 节点网络设备发送的丢弃包数量.
  
**告警规则**   
```
    - alert: NodeNetworkTransmitdrop
      expr: rate(node_network_transmit_drop_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网络设备发送丢包 (Instance:{{ $labels.instance }})
        description: "5分钟内网络({{ $labels.device }})大约{{ printf \"%.0f\" $labels.value }}个发送包丢弃"
``` 
```En
    - alert: NodeNetworkTransmitdrop
      expr: rate(node_network_transmit_drop_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network transmit_drop (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{ printf \"%.0f\" $labels.value }} transmit_drop within 5 minutus"
```    

## ◆ 节点网络设备发送速率高  
**指标**   
- "node_network_transmit_bytes_total":  节点网络设备发送包总数.
  
**告警规则**   
```
    - alert: NodeNetworkTransmitRateHigh
      expr: rate(node_network_transmit_bytes_total{device!="lo"}[5m])/1024/1024 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网设备络发送速率高(Instance:{{ $labels.instance }})
        description: "网络设备({{ $labels.device }}) 发送速率超过80MB/s,value:{{ $labels.value }}%"
``` 
```
    - alert: NodeNetworkTransmitRateHigh
      expr: rate(node_network_transmit_bytes_total{device!="lo"}[5m])/1024/1024 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network transmit rate high (Instance:{{ $labels.instance }})
        description: "The transmission rate of network({{ $labels.device }}) exceeds 80MB/s within 5 minutes,value:{{ $labels.value }}%"
``` 

## ◆ 节点网络设备接收包错误  
**指标**   
- "node_network_receive_errs_total": 节点网络设备接收的错误包数量.
  
**告警规则**   
```
    - alert: NodeNetworkReceiveErr
      expr: rate(node_network_receive_errs_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网络设备接收包错误 (Instance:{{ $labels.instance }})
        description: "5分钟内网络设备({{ $labels.device }})大约{{ printf \"%.0f\" $labels.value }}个接收包错误"
```   
```
    - alert: NodeNetworkReceiveErr
      expr: rate(node_network_receive_errs_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network receive_errs (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{ printf \"%.0f\" $labels.value }} receive_errs within 5 minutus"
```   

## ◆ 节点网络设备接收丢包
**指标**   
- "node_network_receive_drop_total": 节点网络设备接收的丢失包数量.
  
**告警规则**   
```
    - alert: NodeNetworkReceivedrop
      expr: rate(node_network_receive_drop_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网络设备接收丢包(Instance:{{ $labels.instance }})
        description: "5分钟内网络设备({{ $labels.device }})大约{{ printf \"%.0f\" $labels.value }}个接收包丢弃"
``` 
```
    - alert: NodeNetworkReceivedrop
      expr: rate(node_network_receive_drop_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network receive_drop (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{ printf \"%.0f\" $labels.value }} receive_drop within 5 minutus"
``` 

## ◆ 节点网络设备接收速率高 
**指标**   
- "node_network_receive_bytes_total": 节点网络设备接收包总数.
  
**告警规则**   
```
    - alert: NodeNetworkReceiveRateHigh
      expr: rate(node_network_receive_bytes_total{device!="lo"}[5m])/1024/1024 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: 节点网设备络接收速率高(Instance:{{ $labels.instance }})
        description: "网络设备({{ $labels.device }}) 接收速率超过80MB/s,value:{{ $labels.value }}MB/s"
``` 
```
    - alert: NodeNetworkReceiveRateHigh
      expr: rate(node_network_receive_bytes_total{device!="lo"}[5m])/1024/1024 > 80
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network receive rate high (Instance:{{ $labels.instance }})
        description: "The receiving rate of network({{ $labels.device }}) exceeds 80MB/s within 5 minutes,value:{{ $labels.value }}MB/s"
``` 

## ◆ 节点时钟不同步 
**指标**   
- "node_timex_sync_status": 时钟是否与时钟服务器同步(1 = yes, 0 = no).
  
**告警规则**   
```
    - alert: NodeClockSyncFailed
      expr: node_timex_sync_status != 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 节点时钟同步失败(Instance:{{ $labels.instance }})
        description: "节点时钟同步失败"
``` 
```
    - alert: NodeClockSyncFailed
      expr: node_timex_sync_status != 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node clock sync failed (Instance:{{ $labels.instance }})
        description: "Node clock sync failed (Instance:{{ $labels.instance }})"
``` 

## ◆ 节点时间偏移高 
**指标**   
- "node_timex_offset_seconds": 本地系统和参考时钟之间的时间偏移量，单位为秒.
  
**告警规则**   
```
    - alert: NodeTimeOffsetHigh
      expr: abs(node_timex_offset_seconds) > 0.1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: 节点时间偏移高 (Instance:{{ $labels.instance }})
        description: "节点时间偏移量超过0.1s,value:{{ printf \"%.3f\" $labels.value }}s "
``` 
```
    - alert: NodeTimeOffsetHigh
      expr: abs(node_timex_offset_seconds) > 0.1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node time offset high (Instance:{{ $labels.instance }})
        description: "The time offset exceeds 0.1s within 5 minutes,value:{{ printf \"%.3f\" $labels.value }}s "
``` 
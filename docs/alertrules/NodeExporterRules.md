# Node/System alert rules

Alert rules designed based on  Node_Exporter's metrics.   

**Alert rule configurations**: &nbsp;&nbsp;&nbsp;&nbsp; [GitHub](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml)

```sh
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/NodeExporterRules.yml
```

## ◆ NodeContextSwitchHigh  
**Description**   
Alert when the average number of context switches per core is high.
This threshold is related to the application the environment is running on.
Please adjust according to system operation when use.

**Metric**   
- "node_context_switches_total": Total number of context switches.   
  
**Alert rules**   
```
    - alert: NodeContextSwitchingHigh
      expr: rate(node_context_switches_total[5m])/count without(mode,cpu) (node_cpu_seconds_total{mode="idle"}) > 2000
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node context switching high (Instance:{{ $labels.instance }})
        description: "Cpu core context switching rate more than 2000 within 5 minutes,value: {{ $labels.value }}"
```

## ◆ NodeCpuLoadHigh  
**Description**   
Alert when CPU core load is high. 
The load of each core instead of the average of the CPU cores.

**Metric**   
- "node_cpu_seconds_total{mode="idle"}": Seconds the CPUs spent in idle mode.   
  
**Alert rules**   
```
  - alert: NodeCpuLoadHigh
      expr: 100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100 > 70
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node cpu load high (Instance:{{ $labels.instance }})
        description: "Node cpu load more than 70% within 5 minutes,value: {{ $labels.value }}%"
```

## ◆ NodeCpuIowaitHigh  
**Description**   
Alert when CPU core iowait is high.     
The iowait of each core instead of the average of the CPU cores.   
High iowait may mean that the hard disk or network is busy.

**Metric**   
- "node_cpu_seconds_total{mode="iowait"}": Seconds the CPUs spent in iowaite mode.   
  
**Alert rules**   
```
    - alert: NodeCpuIowaitHigh
      expr: rate(node_cpu_seconds_total{mode="iowait"}[5m])*100 > 5
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node cpu iowait high (Instance:{{ $labels.instance }})
        description: "Node cpu core(core:{{ $labels.cpu }}) iowait more than 5% within 5 minutes,value: {{ $labels.value }}%"
```

## ◆ NodeDisksMissing  
**Description**   
Alarm when the number of hard disks is less than the threshold.
This alarm rule is often used in scenarios with multiple hard disks such as storage clusters.
Please modify the threshold when using.

**Metric**   
- "node_disk_io_now": The number of I/Os currently in progress. This is used to count the number of hard disks.
  
**Alert rules**   
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

## ◆ NodeDisksIOHigh 
**Description**   
Please modify the threshold when using.

**Metric**   
- "node_disk_io_now": The number of I/Os currently in progress.
  
**Alert rules**   
```
    - alert: NodeDisksIOHigh
      expr: node_disk_io_now > 50
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node disks I/O High(Instance:{{ $labels.instance }})
        description: "The disk I/O of device({{ $labels.device }}) exceeds 50 within 5 minutes,value:{{ $labels.value }}"
```

## ◆ NodeDiskReadRateHigh  
**Metric**   
- "node_disk_read_bytes_total":  The total number of bytes read successfully.
  
**Alert rules**   
```
    - alert: NodeDiskReadRateHigh
      expr: rate(node_disk_read_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node disk read rate high (Instance:{{ $labels.instance }})
        description: "The read rate of disk({{ $labels.device }}) exceeds 50MB/s within 5 minutes,value:{{ $labels.value }}MB/s"
``` 

## ◆ NodeDiskWrittenRateHigh  
**Metric**   
- "node_disk_written_bytes_total":  The total number of bytes written successfully.
  
**Alert rules**   
```
    - alert: NodeDiskWrittenRateHigh
      expr: rate(node_disk_written_bytes_total[5m])/1024/1024 > 50
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node disk written rate high (Instance:{{ $labels.instance }})
        description: "The written rate of disk({{ $labels.device }}) exceeds 50MB/s within 5 minutes,value:{{ $labels.value }}MB/s"
``` 

## ◆ NodeFilesystemUsageHigh  
**Metric**   
- "node_filesystem_size_bytes": Filesystem size in bytes
- "node_filesystem_free_bytes":  Filesystem free space in bytes.
  
**Alert rules**   
```
    - alert: NodeFilesystemFull
      expr: 100 - node_filesystem_free_bytes{mountpoint!~"/boot.*|/run.*"}/node_filesystem_size_bytes*100 > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node filesystem usage high (Instance:{{ $labels.instance }})
        description: "The used space of the filesystem(mountpoint:{{ $labels.mountpoint }})  is more than 80%，value: {{ $labels.value }}%"
```

## ◆ NodeFilesystemWillFull 
**Description**
Alert when the file system is predicted to be full.
**Metric**   
- "node_filesystem_size_bytes": Filesystem size in bytes
- "node_filesystem_free_bytes":  Filesystem free space in bytes.
  
**Alert rules**   
```
    - alert: NodeFilesystemWillFull
      expr: 100 - predict_linear(node_filesystem_free_bytes[24h], 7*24*3600)/node_filesystem_size_bytes*100 > 100
      for: 0m
      labels:
        severity: info
      annotations:
        summary: Node filesystem will full (Instance:{{ $labels.instance }})
        description: "The filesystem(mountpoint:{{ $labels.mountpoint }}) is predicted to be full within 7 days，value: {{ $labels.value }}%"
```
## ◆ NodeFilesystemReadonly 
**Metric**   
- "node_filesystem_readonly": Filesystem read-only status.
  
**Alert rules**   
```
    - alert: NodeFilesystemReadonly
      expr: node_filesystem_readonly != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Node filesystem readonly (Instance:{{ $labels.instance }})
        description: "The filesystem(mountpoint:{{ $labels.mountpoint }}) is readonly"
```


## ◆ NodeFilesystemDeviceError 
**Metric**   
- "node_filesystem_device_error": Whether an error occurred while getting statistics for the given device.
  
**Alert rules**   
```
    - alert: NodeFilesystemDeviceError
      expr: node_filesystem_device_error != 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Node filesystem device error (Instance:{{ $labels.instance }})
        description: "An error occurred while getting statistics for device({{ $labels.mountpoint }})"
```

## ◆ NodeInodeUsageHigh 
**Metric**   
- "node_filesystem_files": Filesystem total file nodes
- "node_filesystem_files_free":  Filesystem total free file nodes.
  
**Alert rules**   
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

## ◆ NodeMemoryUsageHigh  
**Metric**   
- "node_memory_MemAvailable_bytes": Memory information field MemAvailable_bytes.
- "node_memory_MemTotal_bytes": Memory information field MemTotal_bytes.
  
**Alert rules**   
```
    - alert: NodeMemoryUsageHigh
      expr: 100- node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node memory usage high (Instance:{{ $labels.instance }})
        description: "Node memory usage more than 70% within 5 minutus，value:{{ $labels.value }}%"
```   

## ◆ NodeSwapMemoryUsageHigh  
**Metric**   
- "node_memory_SwapFree_bytes": Memory information field SwapFree_bytes.
- "node_memory_SwapTotal_bytes": Memory information field SwapTotal_bytes.
  
**Alert rules**   
```
    - alert: NodeSwapMemoryUsageHigh
      expr: 100 - node_memory_SwapFree_bytes/node_memory_SwapTotal_bytes*100 > 70
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Node swap memory usage high (Instance:{{ $labels.instance }})
        description: "Node swap memory usage more than 70% within 5 minutus，value:{{ $labels.value }}%"
```   

## ◆ NodeNetworkTransmitErr  
**Metric**   
- "node_network_transmit_errs_total": Network device statistic transmit_errs.
  
**Alert rules**   
```
    - alert: NodeNetworkTransmitErr
      expr: rate(node_network_transmit_errs_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network transmit_errs (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{  printf \"%.0f\" $labels.value }} transmit_errs within 5 minutus"
```   

## ◆ NodeNetworkTransmitDrop  
**Metric**   
- "node_network_transmit_drop_total": Network device statistic transmit_drop.
  
**Alert rules**   
```
    - alert: NodeNetworkTransmitdrop
      expr: rate(node_network_transmit_drop_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Node network transmit_drop (Instance:{{ $labels.instance }})
        description: "Node network({{ $labels.device }}) have {{ printf \"%.0f\" $labels.value }} transmit_drop within 5 minutus"
```   

## ◆ NodeNetworkTransmitRateHigh  
**Metric**   
- "node_network_transmit_bytes_total":  Network device statistic transmit_bytes.
  
**Alert rules**   
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

## ◆ NodeNetworkReceiveErr  
**Metric**   
- "node_network_receive_errs_total": Network device statistic receive_errs.
  
**Alert rules**   
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

## ◆ NodeNetworkReceiveDrop  
**Metric**   
- "node_network_receive_drop_total": Network device statistic receive_drop.
  
**Alert rules**   
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

## ◆ NodeNetworkReceiveRateHigh  
**Metric**   
- "node_network_receive_bytes_total":  Network device statistic receive_bytes.
  
**Alert rules**   
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

## ◆ NodeClockSyncFailed  
**Metric**   
- "node_timex_sync_status": Is clock synchronized to a reliable server (1 = yes, 0 = no).
  
**Alert rules**   
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

## ◆ NodeTimeOffsetHigh 
**Metric**   
- "node_timex_offset_seconds": Time offset in between local system and reference clock.
  
**Alert rules**   
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
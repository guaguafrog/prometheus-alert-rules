# Prometheus自身告警规则

基于Prometheus自身的监控指标设计的告警规则。   

**配置文件**： [GitHub](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules_Zh.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules_Zh.yml) &nbsp;&nbsp;&nbsp;&nbsp; [GitHub(英文版本)](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee(英文版本)](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/NodeExporterRules.yml)

```
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/NodeExporterRules_Zh.yml
```
```英文版本
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/NodeExporterRules.yml
```

## 1. 监控目标丢失  
**描述**  
Target无法连接时产生告警 

**指标**   
- "up": 用于判断Prometheus中配置的监控目标（Target）是否在线。   
  
**告警规则**   
```
    - alert: TargetDown
      expr: up == 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: 监控目标（Target）丢失(实例:{{ $labels.instance }})
        description: "监控目标丢失"
```
```En
    - alert: TargetDown
      expr: up == 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Target down (Instance:{{ $labels.instance }})
        description: "Target Down"
```
> 注： 此规则作用于prometheus中配置的所有的监控目标(target)，不仅仅是prometheus自身。

## 2. Prometheus配置文件重载失败
**描述**  
Prometheus具有热加载配置文件的功能，无需重启prometheus服务。当配置文件重新加载失败时产生告警。 
> 注： 从 Prometheus2.0 开始，热加载功能是默认关闭的，如需开启，需要在启动 Prometheus 的时候，添加 --web.enable-lifecycle 参数。

**指标**   
- "prometheus_config_last_reload_successful": 判断Prometheus的配置文件重新加载是否成功。 
  
**告警规则**   
```
    - alert: PrometheusConfigurationReloadFailure
      expr: prometheus_config_last_reload_successful != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus配置文件重载失败（Instance:{{ $labels.instance }}）
        description: "Prometheus的配置文件重新加载失败"
```   
```En
    - alert: PrometheusConfigurationReloadFailure
      expr: prometheus_config_last_reload_successful != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus configuration reload failure (instance {{ $labels.instance }})
        description: "Prometheus configuration reload failure"
```

## 3. Prometheus未连接到Alertmanager
**描述**  
没有配置AlertManager，或配置的AlertManager服务未运行，导致Prometheus无法连接到AlertManager服务。

**指标**   
- "prometheus_notifications_alertmanagers_discovered": 发现的正常运行的AlertManger的数量 。
  
**告警规则**   
```
    - alert: PrometheusNotConnectedToAlertmanager
      expr: prometheus_notifications_alertmanagers_discovered < 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Prometheus未连接到AlertManager (Instance:{{ $labels.instance }})
        description: "Prometheus未连接到AlertManager超过5分钟，可能是AlertManager运行不正常或未配置AlertManager"
``` 
```En
    - alert: PrometheusNotConnectedToAlertmanager
      expr: prometheus_notifications_alertmanagers_discovered < 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Prometheus not connected to alertmanager (instance {{ $labels.instance }})
        description: "Prometheus cannot connect a active alertmanager within 5 minutes"
```
> 注：若Prometheus无需连接AlertManager，请删除此条告警规则。

## 4. Prometheus告警通知被丢弃
**描述**  
由Prometheus发送给AlertManager的告警通知，由于错误被丢弃。比如AlertManager服务异常，导致无可用的AlertManager可接收告警通知。

**指标**   
- "prometheus_notifications_dropped_total": 发送到Alertmanager的由于错误而丢弃的警报总数。 
  
**告警规则**   
```
    - alert: PrometheusNotificationsDropped
      expr: increase(prometheus_notifications_dropped_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus告警通知被丢弃（Instance:{{ $labels.instance }}）
        description: "5分钟内Prometheus丢弃了大约{{  $value }}个告警通知"
```   
```En
    - alert: PrometheusNotificationsDropped
      expr: increase(prometheus_notifications_dropped_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus notifications dropped（Instance:{{ $labels.instance }}）
        description: "Prometheus dropped about {{  $value }}  notifications within 5 minutes"
```   

## 5. Prometheus告警通知积压
**描述**  
由Prometheus向AlertManager发送告警通知出现积压。

**指标**   
- "prometheus_notifications_queue_length": 队列中的告警通知数。
  
**告警规则**   
```
    - alert: PrometheusNotificationsBacklog
      expr: min_over_time(prometheus_notifications_queue_length[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus告警通知积压(Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus积压了{{ $value }}条告警通知"
``` 
```En
    - alert: PrometheusNotificationsBacklog
      expr: min_over_time(prometheus_notifications_queue_length[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus notifications backlog (Instance:{{ $labels.instance }})
        description: "Prometheus has a backlog of about {{ $value }}  notifications within 5 minutes"
``` 
## 6. Prometheus运行异常
**描述**  
Promehteus是否启动完成，服务是否运行正常。

**指标**   
- "prometheus_ready": Prometheus运行正常的指标
  
**告警规则**   
```
    - alert: PrometheusNotReady
      expr: prometheus_ready != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus服务运行不正常(Instance:{{ $labels.instance }})
        description: "Prometheus服务运行不正常"
``` 
```En
    - alert: PrometheusNotReady
      expr: prometheus_ready != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus not ready (Instance:{{ $labels.instance }})
        description: "Prometheus not ready"
``` 

## 7. Prometheus规则评估失败
**描述**  
Promehteus的告警规则评估失败。

**指标**   
- "prometheus_rule_evaluation_failures_total": Prometheus告警规则评估失败的总数
  
**告警规则**   
```
    - alert: PrometheusRuleEvaluationFailed
      expr: increase(prometheus_rule_evaluation_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus告警规则评估失败(Instance:{{ $labels.instance }})
        description: "5分钟内告警规则评估失败大约{{ $value }}次"
``` 
```En
    - alert: PrometheusRuleEvaluationFailed
      expr: increase(prometheus_rule_evaluation_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus rule evaluation failed (Instance:{{ $labels.instance }})
        description: "Prometheus rule evaluation failed about {{ $value }} times within 5 minutes"
``` 
## 8. Prometheus模板扩展失败
**描述**  
Prometheus模板文件扩展失败

**指标**   
- "prometheus_template_text_expansion_failures_total": Prometheus模板文件扩展失败的数量
  
**告警规则**   
```
    - alert: PrometheusTemplateTextExpansionFailed
      expr: increase(prometheus_template_text_expansion_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus模板文件扩展失败 (Instance:{{ $labels.instance }})
        description: "5分钟内模板文件扩展失败大约{{ $value }}次"
``` 
```En
    - alert: PrometheusTemplateTextExpansionFailed
      expr: increase(prometheus_rule_evaluation_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus template text expansion failed (Instance:{{ $labels.instance }})
        description: "Prometheus template text expansion failed about {{ $value }} times within 5 minutes"
```   

## 9. Prometheus规则组评估慢
**描述**  
Prometheus规则组的评估持续时间比预定的时间长，它表示存储后端访问较慢或规则设计太复杂。

**指标**   
- "prometheus_rule_group_last_duration_seconds": Prometheus规则组评估花费的时间   
- "prometheus_rule_group_interval_seconds": 规则组的间隔时间，即15秒启动一次规则组评估
  
**告警规则**   
```
    - alert: PrometheusRuleGroupEvaluationSlow
      expr: prometheus_rule_group_last_duration_seconds > prometheus_rule_group_interval_seconds
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus规则组评估慢 (Instance:{{ $labels.instance }})
        description: "规则组{{ $labels.rule_group }}评估持续时间太长,时间为{{ $value }}"
``` 
```En
    - alert: PrometheusRuleGroupEvaluationSlow
      expr: prometheus_rule_group_last_duration_seconds > prometheus_rule_group_interval_seconds
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus rule group evaluation slow (Instance:{{ $labels.instance }})
        description: "The evaluation time of rule group({{ $labels.rule_group }}) is too long,value {{ $value }}"
```   

## 10. Prometheus拒绝异常样本
**描述**  
由于时间戳重复但是值不同的异常样本Prometheus拒绝。

**指标**   
- "prometheus_target_scrapes_sample_duplicate_timestamp_total": 由于时间戳重复但值不同而拒绝的样本总数。 

  
**告警规则**   
```
    - alert: PrometheusScrapesSamplesRejected
      expr: increase(prometheus_target_scrapes_sample_duplicate_timestamp_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus异常样本被拒绝 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus拒绝的异常样本数量大约为{{ $value }}"
``` 
```En
    - alert: PrometheusScrapesSamplesRejected
      expr: increase(prometheus_target_scrapes_sample_duplicate_timestamp_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus scrapes samples regected (Instance:{{ $labels.instance }})
        description: " The number of samples rejected is about {{ $value }} within 5 minutes"
```   
## 11. PrometheusTsdb检查点创建失败
**描述**  
Prometheus后端存储TSDB创建检查点失败

**指标**   
- "prometheus_tsdb_checkpoint_creations_failed_total": Prometheus后端存储TSDB创建检查点失败的总数。 

**告警规则**   
```
    - alert: PrometheusTsdbCheckpointCreationsFailed
      expr: increase(prometheus_tsdb_checkpoint_creations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 创建检查点失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus出现大约{{ $value }}次创建检查点失败"
``` 
```En
    - alert: PrometheusTsdbCheckpointCreationsFailed
      expr: increase(prometheus_tsdb_checkpoint_creations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb checkpoint creations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} checkpoint creations failure within 5 minutes"
```   

## 12. PrometheusTsdb检查点删除失败
**描述**  
Prometheus后端存储TSDB删除检查点失败

**指标**   
- "prometheus_tsdb_checkpoint_deletions_failed_total": Prometheus后端存储TSDB删除检查点失败的总数。 

**告警规则**   
```
    - alert: PrometheusTsdbCheckpointDeletionsFailed
      expr: increase(prometheus_tsdb_checkpoint_deletions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 删除检查点失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus出现大约{{ $value }}次删除检查点失败"
``` 
```En
    - alert: PrometheusTsdbCheckpointDeletionsFailed
      expr: increase(prometheus_tsdb_checkpoint_deletions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb checkpoint deletions failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} checkpoint deletions failure within 5 minutes"
```   

## 13. PrometheusTsdb数据压缩失败
**描述**  
Prometheus后端存储TSDB数据压缩失败

**指标**   
- "prometheus_tsdb_compactions_failed_total": Prometheus后端存储TSDB数据压缩失败的总数。 
 
**告警规则**   
```
    - alert: PrometheusTsdbCompactionsFailed
      expr: increase(prometheus_tsdb_compactions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 数据压缩失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus出现大约{{ $value }}次删数据压缩失败"
``` 
```En
    - alert: PrometheusTsdbCompactionsFailed
      expr: increase(prometheus_tsdb_compactions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb compactions failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} compactions failure within 5 minutes"
```   

## 14. PrometheusTsdb头部数据块删减失败
**描述**  
Prometheus后端存储TSDB头部数据块删减失败

**指标**   
- "prometheus_tsdb_head_truncations_failed_total": Prometheus后端存储TSDB头部数据块删减失败的总数。 

**告警规则**   
```
    - alert: PrometheusTsdbHeadTruncationsFailed
      expr: increase(prometheus_tsdb_head_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 头部数据删减失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus出现大约{{ $value }}次头部数据块删减失败"
``` 
```En
    - alert: PrometheusTsdbHeadTruncationsFailed
      expr: increase(prometheus_tsdb_head_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb head truncations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} head truncations failure within 5 minutes"
```   

## 15. PrometheusTsdb重载失败
**描述**  
Prometheus后端存储TSDB从磁盘重新加载数据失败

**指标**   
- "prometheus_tsdb_reloads_failures_total": Prometheus后端存储TSDB从磁盘重新加载数据失败的次数。 

  
**告警规则**   
```
    - alert: PrometheusTsdbReloadsFailed
      expr: increase(prometheus_tsdb_reloads_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 数据重加载失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus tsdb出现大约{{ $value }}次数据重加载失败"
``` 
```En
    - alert: PrometheusTsdbReloadsFailed
      expr: increase(prometheus_tsdb_reloads_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb reloads  failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} reloads failure within 5 minutes"
```   
## 16. PrometheusTsdbWal删减失败
**描述**  
Prometheus后端存储TSDB写入数据WAL删减失败

**指标**   
- "prometheus_tsdb_wal_truncations_failed_total": Prometheus后端存储TSDB写入日志WAL的删减失败次数。 

**告警规则**   
```
    - alert: PrometheusTsdbWalTruncationsFailed
      expr: increase(prometheus_tsdb_wal_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb 写入日志WAL删减失败 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus tsdb出现大约{{ $value }}次写入日志WAL删减失败"
``` 
```En
    - alert: PrometheusTsdbWalTruncationsFailed
      expr: increase(prometheus_tsdb_wal_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb wal truncations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} wal truncations failure within 5 minutes"
```   
## 17. PrometheusTsdbWal损害
**描述**  
Prometheus后端存储TSDB的WAL损坏

**指标**   
- "prometheus_tsdb_wal_corruptions_total": Prometheus后端存储TSDB的WAL损坏数量。 

**告警规则**   
```
    - alert: PrometheusTsdbWalCorruptions
      expr: increase(prometheus_tsdb_wal_corruptions_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb的WAL损坏 (Instance:{{ $labels.instance }})
        description: "5分钟内Prometheus tsdb出现大约{{ $value }}次wal损坏"
``` 
```En
    - alert: PrometheusTsdbWalCorruptions
      expr: increase(prometheus_tsdb_wal_corruptions_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb wal corruptions (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} wal corruptions within 5 minutes"
```  

## 18. AlertManager配置文件重载失败
**描述**  
AlertManager的配置文件重新加载失败

**指标**   
- "prometheus_config_last_reload_successful": 判断AlertManager的配置文件重新加载是否成功。 
  
**告警规则**   
```
    - alert: AlertManagerConfigReloadFailure
      expr: alertmanager_config_last_reload_successfull != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: AlertManager配置文件重载失败（Instance:{{ $labels.instance }}）
        description: "AlertManager的配置文件重新加载失败"
```   
```En
    - alert: AlertManagerConfigReloadFailure
      expr: alertmanager_config_last_reload_successfull != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: AlertManager configuration reload failure (instance {{ $labels.instance }})
        description: "AlertManager configuration reload failure"
```
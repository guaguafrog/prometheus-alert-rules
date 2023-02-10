# Prometheus Alert Rules

Alert rules designed based on  Prometheus's metrics.   

**Alert rule configurations**: &nbsp;&nbsp;&nbsp;&nbsp; [GitHub](https://github.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/PrometheusSelfRules.yml) &nbsp;&nbsp;&nbsp;&nbsp; [Gitee](https://gitee.com/guaguafrog/prometheus-alert-rules/blob/main/alertrules/PrometheusSelfRules.yml)

```sh
wget https://raw.githubusercontent.com/guaguafrog/prometheus-alert-rules/main/alertrules/PrometheusSelfRules.yml
```

## ◆ TargetDown  
**Metrics**   
- "up": It is used to determine whether the target (configured in Prometheus) is online.(0:offline,1:online)   

**Alert Rules**   
```
    - alert: TargetDown
      expr: up == 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Target down (Instance:{{ $labels.instance }})
        description: "Target Down"
```   
> Note: This rule applies to all targets configured in prometheus, not only prometheus itself.

## ◆ PrometheusConfigReloadFailed
**Metrics**   
- "prometheus_config_last_reload_successful": Whether the last configuration reload attempt was successful. 

**Alert Rules**   
```
    - alert: PrometheusConfigReloadFailed
      expr: prometheus_config_last_reload_successful != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus configuration reload failure (instance {{ $labels.instance }})
        description: "Prometheus configuration reload failure"
```

## ◆ PrometheusNotConnectedToAlertmanager

**Metrics**   
- "prometheus_notifications_alertmanagers_discovered": The number of alertmanagers discovered and active.   

**Alert Rules**   
```
    - alert: PrometheusNotConnectedToAlertmanager
      expr: prometheus_notifications_alertmanagers_discovered < 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Prometheus not connected to alertmanager (instance {{ $labels.instance }})
        description: "Prometheus cannot connect a active alertmanager within 5 minutes"
```

## ◆ PrometheusNotificationsDropped
**Metrics**   
- "prometheus_notifications_dropped_total": Total number of alerts dropped due to errors when sending to Alertmanager. 

**Alert Rules**   
```
    - alert: PrometheusNotificationsDropped
      expr: increase(prometheus_notifications_dropped_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus notifications dropped（Instance:{{ $labels.instance }}）
        description: "Prometheus dropped about {{  $value }}  notifications within 5 minutes"
```   

## ◆ PrometheusNotificationsBacklog
**Metrics**   
- "prometheus_notifications_queue_length": The number of alert notifications in the queue.

**Alert Rules**   
```
    - alert: PrometheusNotificationsBacklog
      expr: min_over_time(prometheus_notifications_queue_length[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus notifications backlog (Instance:{{ $labels.instance }})
        description: "Prometheus has a backlog of about {{ $value }}  notifications within 5 minutes"
``` 
## ◆ PrometheusNotReady
**Metrics**   
- "prometheus_ready": Whether Prometheus startup was fully completed and the server is ready for normal operation.

**Alert Rules**   
```
    - alert: PrometheusNotReady
      expr: prometheus_ready != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus not ready (Instance:{{ $labels.instance }})
        description: "Prometheus not ready"
``` 

## ◆ PrometheusRuleEvaluationFailed
**Metrics**   
- "prometheus_rule_evaluation_failures_total": The total number of rule evaluation failures.

**Alert Rules**   
```
    - alert: PrometheusRuleEvaluationFailed
      expr: increase(prometheus_rule_evaluation_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus rule evaluation failed (Instance:{{ $labels.instance }})
        description: "Prometheus rule evaluation failed about {{ $value }} times within 5 minutes"
``` 
## ◆ PrometheusTemplateTextExpansionFailed
**Metrics**   
- "prometheus_template_text_expansion_failures_total": The total number of template text expansion failures.

**Alert Rules**   
```
    - alert: PrometheusTemplateTextExpansionFailed
      expr: increase(prometheus_rule_evaluation_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus template text expansion failed (Instance:{{ $labels.instance }})
        description: "Prometheus template text expansion failed about {{ $value }} times within 5 minutes"
```   

## ◆ PrometheusRuleGroupEvaluationSlow
**Metrics**   
- "prometheus_rule_group_last_duration_seconds": The duration of the last rule group evaluation.  
- "prometheus_rule_group_interval_seconds": The interval of a rule group.

**Alert Rules**   
```
    - alert: PrometheusRuleGroupEvaluationSlow
      expr: prometheus_rule_group_last_duration_seconds > prometheus_rule_group_interval_seconds
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus rule group evaluation slow (Instance:{{ $labels.instance }})
        description: "The evaluation time of rule group({{ $labels.rule_group }}) is too long, value:{{ $value }}"
```   

## ◆ PrometheusScrapesSamplesRejected
**Metrics**   
- "prometheus_target_scrapes_sample_duplicate_timestamp_total": Total number of samples rejected due to duplicate timestamps but different values. 

**Alert Rules**   
```
    - alert: PrometheusScrapesSamplesRejected
      expr: increase(prometheus_target_scrapes_sample_duplicate_timestamp_total[5m]) > 0
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Prometheus scrapes samples regected (Instance:{{ $labels.instance }})
        description: " The number of samples rejected is about {{ $value }} within 5 minutes"
```  

## ◆ PrometheusTsdbCheckpointCreationsFailed
**Metrics**   
- "prometheus_tsdb_checkpoint_creations_failed_total": Total number of checkpoint creations that failed.

**Alert Rules**   
```
    - alert: PrometheusTsdbCheckpointCreationsFailed
      expr: increase(prometheus_tsdb_checkpoint_creations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb checkpoint creations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} checkpoint creations failure within 5 minutes"
```   

## ◆ PrometheusTsdbCheckpointDeletionsFailed
**Metrics**   
- "prometheus_tsdb_checkpoint_deletions_failed_total": Total number of checkpoint deletions that failed. 

**Alert Rules**   
```
    - alert: PrometheusTsdbCheckpointDeletionsFailed
      expr: increase(prometheus_tsdb_checkpoint_deletions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb checkpoint deletions failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} checkpoint deletions failure within 5 minutes"
```   

## ◆ PrometheusTsdbCompactionsFailed
**Metrics**   
- "prometheus_tsdb_compactions_failed_total": Total number of compactions that failed for the partition. 
  
**Alert Rules**   

```
    - alert: PrometheusTsdbCompactionsFailed
      expr: increase(prometheus_tsdb_compactions_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb compactions failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} compactions failure within 5 minutes"
```   

## ◆ PrometheusTsdbHeadTruncationsFailed
**Metrics**   
- "prometheus_tsdb_head_truncations_failed_total": Total number of head truncations that failed.

**Alert Rules**   
```
    - alert: PrometheusTsdbHeadTruncationsFailed
      expr: increase(prometheus_tsdb_head_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb head truncations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} head truncations failure within 5 minutes"
```   

## ◆ PrometheusTsdbReloadsFailed
**Metrics**   
- "prometheus_tsdb_reloads_failures_total": Number of times the database failed to reload block data from disk.  

**Alert Rules**   
```
    - alert: PrometheusTsdbReloadsFailed
      expr: increase(prometheus_tsdb_reloads_failures_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb reloads  failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} reloads failure within 5 minutes"
```   

## ◆ PrometheusTsdbWalTruncationsFailed
**Metrics**   
- "prometheus_tsdb_wal_truncations_failed_total": Total number of write log truncations that failed.
  
**Alert Rules**   
```
    - alert: PrometheusTsdbWalTruncationsFailed
      expr: increase(prometheus_tsdb_wal_truncations_failed_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb wal truncations failed (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} wal truncations failure within 5 minutes"
```   
## ◆ PrometheusTsdbWalCorruptions
**Metrics**   
- "prometheus_tsdb_wal_corruptions_total": Total number of WAL corruptions. 

**Alert Rules**   
```
    - alert: PrometheusTsdbWalCorruptions
      expr: increase(prometheus_tsdb_wal_corruptions_total[5m]) > 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus tsdb wal corruptions (Instance:{{ $labels.instance }})
        description: "Prometheus tsdb has {{ $value }} wal corruptions within 5 minutes"
```  

## ◆ AlertManagerConfigReloadFailed
**Metrics**   
- "prometheus_config_last_reload_successful": Whether the last configuration reload attempt was successful. 

**Alert Rules**   
```
    - alert: AlertManagerConfigReloadFailed
      expr: alertmanager_config_last_reload_successfull != 1
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: AlertManager configuration reload failure (instance {{ $labels.instance }})
        description: "AlertManager configuration reload failure"
```
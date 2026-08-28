# Backend Runtime Profiling & Memory Leak Hunting Guide

## Overview
Backend performance and stability depend on maintaining low event loop latency, eliminating CPU hot spots, and preventing memory leaks in long-running services.

---

## 1. Node.js Event Loop Utilization (ELU)

```typescript
import { performance, eventLoopUtilization } from 'perf_hooks';

let lastELU = eventLoopUtilization();

setInterval(() => {
  const currentELU = eventLoopUtilization(lastELU);
  lastELU = eventLoopUtilization();

  if (currentELU.utilization > 0.70) {
    console.warn(`⚠️ High Event Loop Utilization: ${(currentELU.utilization * 100).toFixed(2)}%`);
  }
}, 5000).unref();
```

---

## 2. Memory Leak Diagnostics & Heap Snapshots

```typescript
import v8 from 'v8';
import fs from 'fs';
import path from 'path';

export function captureHeapSnapshot(tag = 'diagnostic'): string {
  const filename = path.join(process.cwd(), `heap-${tag}-${Date.now()}.heapsnapshot`);
  const stream = v8.getHeapSnapshot();
  const fileStream = fs.createWriteStream(filename);
  stream.pipe(fileStream);
  return filename;
}
```

---

## 3. Go Runtime Profiling (`pprof`)

```go
package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"
)

func main() {
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()
}
```

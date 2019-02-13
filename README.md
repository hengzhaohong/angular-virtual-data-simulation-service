# angular_virtual_data_simulation_service
A service for generating virtual data in any front-end Angular projects without back-end support.

## How to Use

1. Download the ZIP file of the repository.
1. Open downloaded ZIP, and copy the file `virtualDataGenerate.service.ts` to a proper place in your Angular project.
1. Inject the `VirtualDataGenerateService` in `virtualDataGenerate.service.ts` into your component via [DI (Dependency Injection)](https://angular.io/guide/dependency-injection), [Chinese version here](https://www.angular.cn/guide/dependency-injection).
1. In your Angular Component, invoke `set()` method of `VirtualDataGenerateService` to set data structure first, and then invoke `get()` method in the component where you need the virtual data.

> Pass proper arguments into the `set()` method to set data, reading the annotations above `set()` and `get()` in `VirtualDataGenerateService` will be of great helpful.

## A Simple Exapmle

### In Angular Components

```ts
// Somewhere excuted before the get() method.
this.virtualDataGenerateService.set({
    yourVarName: [
        'userName',
        ['enabled', true],
        ['id', 'number'],
        2
    ]
});
// Somewhere you need virtual data.
data = this.virtualDataGenerateService.get('yourVarName');
```

### Output

```ts
// For example above
console.log(data);

data = [
    {
        userName: '测试userName1',
        enabled: true,
        id: 1
    }
    {
        userName: '测试userName2',
        enabled: true,
        id: 2
    }
]
```
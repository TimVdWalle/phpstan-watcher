# phpstan-watcher


------


## ✨ Getting Started In 4 easy Steps


**1**: First, you may use npm to install phpstan-watcher globally:

```bash
npm i -g phpstan-watcher
```


**2**: Then, install phpstan and/or larastan


**3**: Important: create script shortcuts in composer.json

```bash
        "analyse": [
            "./vendor/bin/phpstan analyse"
        ],
        "analyse-json": [
            "./vendor/bin/phpstan analyse --error-format=json"
        ]
```

**4**: Finally, start phpstan-watcher in the root of your project folder
```bash
npm exec phpstan-watcher
```
or
```bash
npx phpstan-watcher
```

## 📖 Notification

For the notifications to work : on mac you should allow terminal notifications


## 📖 License

Phpstan-watcher is an open-sourced software licensed under the ISC License.


## 📖 Author

Tim Vande Walle

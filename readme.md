# note-cli

> A minimal, interactive note-taking tool for the terminal.

## Install

```bash
npm install --global note-cli
```

> **Requirements:** Node.js ≥ 16

## Usage

```
note-cli [flag] [id]
```

| Flag            | Shorthand | Description          |
| --------------- | --------- | -------------------- |
| `--create`      | `-c`      | Create a new note    |
| `--read`        | `-r`      | List all notes       |
| `--read <id>`   | `-r <id>` | Read a specific note |
| `--update`      | `-u`      | Update a note        |
| `--delete <id>` | `-d <id>` | Delete a note by ID  |
| `--delete all`  | `-d all`  | Delete all notes     |

## Examples

**Create a note**

```bash
note-cli --create
note-cli -c
```

**List all notes**

```bash
note-cli --read
note-cli -r
```

**Read a specific note**

```bash
note-cli --read fc4c754d4
note-cli -r fc4c754d4
```

**Update a note**

```bash
note-cli --update
note-cli -u
```

**Delete a note**

```bash
note-cli --delete fc4c754d4
note-cli -d fc4c754d4
```

**Delete all notes**

```bash
note-cli --delete all
note-cli -d all
```

## Notes

- Notes are stored locally in `db.json` in the working directory.
- Title limit: **50 characters**
- Content limit: **300 characters**

## License

MIT

var test = require('tape')
var hyper = require('hyperdb')
var Osm = require('..')
var ram = require('random-access-memory')

test('create unknown element', function (t) {
  t.plan(1)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  var node = {
    type: 'cortada',
    changeset: '9',
    lat: '-11',
    lon: '-10',
    timestamp: '2017-10-10T19:55:08.570Z'
  }

  osm.create(node, function (err) {
    t.ok(err instanceof Error)
  })
})

test('create good nodes', function (t) {
  var nodes = [
    {
      type: 'node',
      changeset: '9',
      lat: '-11',
      lon: '-10',
      timestamp: '2017-10-10T19:55:08.570Z'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '-11',
      lon: '-10'
    }
  ]

  t.plan(nodes.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  nodes.forEach(function (node) {
    osm.create(node, function (err) {
      t.error(err)
    })
  })
})

test('create bad nodes', function (t) {
  var nodes = [
    {
      type: 'node',
    },
    {
      type: 'node',
      changeset: '9'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '12'
    },
    {
      type: 'node',
      changeset: '9',
      lon: '-7'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '-91',
      lon: '-7'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '291',
      lon: '-7'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '31',
      lon: '-185'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '31',
      lon: '185'
    },
    {
      type: 'node',
      changeset: '9',
      lat: '31',
      lon: '85',
      timestamp: 'soon'
    },
  ]

  t.plan(nodes.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  nodes.forEach(function (node, idx) {
    osm.create(node, function (err) {
      t.ok(err instanceof Error, 'nodes['+idx+']')
    })
  })
})

test('create good ways', function (t) {
  var ways = [
    {
      type: 'way',
      changeset: '19',
      refs: ['bob', 'dole', 'for', 'prez'],
      timestamp: '2017-10-10T19:55:08.570Z'
    },
    {
      type: 'way',
      changeset: '19',
      refs: ['bob', 'dole', 'for', 'prez']
    },
    {
      type: 'node',
      changeset: '9',
      lat: '-11',
      lon: '-10',
      extra: 'field'
    }
  ]

  t.plan(ways.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  ways.forEach(function (node) {
    osm.create(node, function (err) {
      t.error(err)
    })
  })
})

test('create bad ways', function (t) {
  var ways = [
    {
      type: 'way'
    },
    {
      type: 'way',
      changeset: '14'
    },
    {
      type: 'way',
      changeset: '14',
      refs: []
    },
    {
      type: 'way',
      changeset: '14',
      refs: ['hi']
    },
    {
      type: 'way',
      changeset: '14',
      refs: ['hi', 'there']
    },
    {
      type: 'way',
      changeset: 14,
      refs: ['hi', 'there', 'friend']
    },
    {
      type: 'way',
      changeset: '14',
      refs: ['hi', 'there', 'friend'],
      timestamp: 'a while ago'
    },
  ]

  t.plan(ways.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  ways.forEach(function (node, idx) {
    osm.create(node, function (err) {
      t.ok(err instanceof Error, 'ways['+idx+']')
    })
  })
})

test('create good relations', function (t) {
  var relations = [
    {
      type: 'relation',
      changeset: '19',
      tags: { waterway: 'river' },
      members: [
        {
          type: 'node',
          id: '101'
        }
      ]
    },
    {
      type: 'relation',
      changeset: '19',
      tags: { waterway: 'river' },
      members: [
        {
          type: 'node',
          id: '101',
          role: 'best-friend'
        }
      ]
    },
    {
      type: 'relation',
      changeset: '21',
      tags: { foo: 'bar' },
      members: []
    }
  ]

  t.plan(relations.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  relations.forEach(function (node) {
    osm.create(node, function (err) {
      t.error(err)
    })
  })
})

test('create bad relations', function (t) {
  var relations = [
    {
      type: 'relation'
    },
    {
      type: 'relation',
      changeset: '21'
    },
    {
      type: 'relation',
      changeset: '21',
      tags: { foo: 'bar' }
    },
    {
      type: 'relation',
      changeset: '21',
      tags: {},
      members: []
    },
    {
      type: 'relation',
      changeset: '21',
      tags: { foo: 'bar' },
      members: {}
    },
    {
      type: 'relation',
      changeset: '21',
      tags: { foo: 'bar' },
      members: [
        {
          type: 'sandwich',
          ref: '17'
        }
      ]
    },
    {
      type: 'relation',
      changeset: '21',
      tags: { foo: 'bar' },
      members: [
        {
          type: 'way',
          id: 17
        }
      ]
    },
  ]

  t.plan(relations.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  relations.forEach(function (node, idx) {
    osm.create(node, function (err) {
      t.ok(err instanceof Error, 'relations['+idx+']')
    })
  })
})

test('create good changesets', function (t) {
  var changesets = [
    {
      type: 'changeset',
    },
    {
      type: 'changeset',
      timestamp: '2017-10-10T19:55:08.570Z'
    },
  ]

  t.plan(changesets.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  changesets.forEach(function (node) {
    osm.create(node, function (err) {
      t.error(err)
    })
  })
})

test('create bad changesets', function (t) {
  var changesets = [
    {
      type: 'changeset',
      timestamp: 'now'
    },
  ]

  t.plan(changesets.length)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  changesets.forEach(function (node, idx) {
    osm.create(node, function (err) {
      t.ok(err instanceof Error, 'changesets['+idx+']')
    })
  })
})

test('create changeset', function (t) {
  t.plan(1)

  var db = hyper(ram, { valueEncoding: 'json' })
  var osm = Osm(db)

  var changes = {
    type: 'changeset'
  }

  osm.create(changes, function (err) {
    t.error(err)
  })
})

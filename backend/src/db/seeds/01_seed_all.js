exports.seed = async function (knex) {
  await knex('stock_transactions').del();
  await knex('parts').del();
  await knex('categories').del();
  await knex('suppliers').del();

  await knex('categories').insert([
    { name: 'Brakes',      description: 'Brake pads, discs, calipers' },
    { name: 'Filters',     description: 'Oil, air, fuel, cabin filters' },
    { name: 'Engine',      description: 'Engine components and gaskets' },
    { name: 'Belts',       description: 'Timing belts, serpentine belts' },
    { name: 'Suspension',  description: 'Shock absorbers, springs, bushings' },
    { name: 'Electrical',  description: 'Batteries, alternators, sensors' },
  ]);

  await knex('suppliers').insert([
    { name: 'AutoParts GmbH',   email: 'info@autoparts.de',   phone: '+49 211 1234567' },
    { name: 'TechDrive Europe', email: 'sales@techdrive.eu',  phone: '+49 89 9876543' },
  ]);

  const categories = await knex('categories').select('id', 'name');
  const cat = Object.fromEntries(categories.map(c => [c.name, c.id]));
  const suppliers = await knex('suppliers').select('id');
  const s1 = suppliers[0].id;
  const s2 = suppliers[1].id;

  await knex('parts').insert([
    { name: 'Front Brake Pad Set',     part_number: 'BP-001', category_id: cat['Brakes'],     supplier_id: s1, price: 34.99,  stock_qty: 25, reorder_level: 5  },
    { name: 'Rear Brake Pad Set',      part_number: 'BP-002', category_id: cat['Brakes'],     supplier_id: s1, price: 29.99,  stock_qty: 18, reorder_level: 5  },
    { name: 'Brake Disc Front Left',   part_number: 'BD-001', category_id: cat['Brakes'],     supplier_id: s1, price: 54.99,  stock_qty: 8,  reorder_level: 3  },
    { name: 'Brake Disc Front Right',  part_number: 'BD-002', category_id: cat['Brakes'],     supplier_id: s1, price: 54.99,  stock_qty: 8,  reorder_level: 3  },
    { name: 'Oil Filter',              part_number: 'FL-001', category_id: cat['Filters'],    supplier_id: s2, price: 8.99,   stock_qty: 60, reorder_level: 10 },
    { name: 'Air Filter',              part_number: 'FL-002', category_id: cat['Filters'],    supplier_id: s2, price: 12.49,  stock_qty: 40, reorder_level: 10 },
    { name: 'Fuel Filter',             part_number: 'FL-003', category_id: cat['Filters'],    supplier_id: s2, price: 14.99,  stock_qty: 3,  reorder_level: 5  },
    { name: 'Cabin Air Filter',        part_number: 'FL-004', category_id: cat['Filters'],    supplier_id: s2, price: 18.99,  stock_qty: 22, reorder_level: 8  },
    { name: 'Timing Belt Kit',         part_number: 'BL-001', category_id: cat['Belts'],      supplier_id: s2, price: 89.99,  stock_qty: 10, reorder_level: 3  },
    { name: 'Serpentine Belt',         part_number: 'BL-002', category_id: cat['Belts'],      supplier_id: s2, price: 32.99,  stock_qty: 15, reorder_level: 4  },
    { name: 'Head Gasket',             part_number: 'EN-001', category_id: cat['Engine'],     supplier_id: s1, price: 124.99, stock_qty: 4,  reorder_level: 2  },
    { name: 'Valve Cover Gasket',      part_number: 'EN-002', category_id: cat['Engine'],     supplier_id: s1, price: 44.99,  stock_qty: 7,  reorder_level: 2  },
    { name: 'Spark Plug (each)',        part_number: 'EN-003', category_id: cat['Engine'],     supplier_id: s2, price: 9.99,   stock_qty: 80, reorder_level: 20 },
    { name: 'Front Shock Absorber',    part_number: 'SP-001', category_id: cat['Suspension'], supplier_id: s1, price: 79.99,  stock_qty: 2,  reorder_level: 2  },
    { name: 'Rear Shock Absorber',     part_number: 'SP-002', category_id: cat['Suspension'], supplier_id: s1, price: 74.99,  stock_qty: 6,  reorder_level: 2  },
    { name: 'Front Coil Spring',       part_number: 'SP-003', category_id: cat['Suspension'], supplier_id: s1, price: 59.99,  stock_qty: 4,  reorder_level: 2  },
    { name: 'Control Arm Bushing Set', part_number: 'SP-004', category_id: cat['Suspension'], supplier_id: s2, price: 24.99,  stock_qty: 12, reorder_level: 4  },
    { name: 'Car Battery 60Ah',        part_number: 'EL-001', category_id: cat['Electrical'], supplier_id: s2, price: 99.99,  stock_qty: 9,  reorder_level: 3  },
    { name: 'Alternator',              part_number: 'EL-002', category_id: cat['Electrical'], supplier_id: s2, price: 189.99, stock_qty: 3,  reorder_level: 2  },
    { name: 'Oxygen Sensor',           part_number: 'EL-003', category_id: cat['Electrical'], supplier_id: s2, price: 49.99,  stock_qty: 11, reorder_level: 3  },
  ]);
};

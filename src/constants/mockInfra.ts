export const getMockResponse = () => {
    const ips: string[] = [
      "54.242.113.101",
      "18.205.76.12",
      "3.91.45.67",
      "35.174.98.200",
      "52.23.154.88"
    ];
    const random = Math.floor(Math.random() * ips.length);
    const totalDatabases = Math.floor(Math.random() * 5) + 1; // Random total between 1 and 5
  
    const instances = {
      ip: ips[random],
      region: "ap-south-1",
      name: "ubuntu-20.04",
      instances: `instance-${random}`,
      status: "running",
    };
  
    const databases = Array.from({ length: totalDatabases }, (_, i) => ({
      name: `pg-${i + 1}`,
      type: "database",
      region: "ap-south-1",
      replicas: 1,
      databaseEngine: "pg-17.2.3",
      status: "running",
      password: "nvew358#aqwa~jnda",
      user: "admin",
      port: "5432",
    }));
  
    const blockStorage = {
      id: `block-${random}`,
      name: `storage-${random}`,
      size: `${100 + random * 10}GB`,
      status: "available",
      cost: `$${(5 + random * 2).toFixed(2)}`,
    };
  
    const response = {
      success: true,
      msg: "Infra fetch success",
      data: {
        blockStorage: {
          blocks: [blockStorage],
          meta: {
            total: 1,
            links: {
              next: "",
              prev: "",
            },
          },
        },
        instances: {
          instances: [instances],
          meta: {
            total: 1,
            links: {
              next: "",
              prev: "",
            },
          },
        },
        db: {
          databases,
          meta: {
            total: totalDatabases, 
          },
        },
      },
    };
  
    return response;
  };
  
  
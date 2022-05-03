interface DBConnectionOptions {
    quiet?: boolean;
    timeout?: number;
}
declare class DB {
    /**
     * Connect to a mongodb instance
     * @param {String} mongoUri mongodb connection string
     * @returns {DBConnectionOptions} mongoose connection
     */
    static connect(mongoUri: string, options?: DBConnectionOptions): Promise<void>;
    /**
     * Drop all collections
     */
    static drop(): Promise<void>;
}
export default DB;
//# sourceMappingURL=index.d.ts.map
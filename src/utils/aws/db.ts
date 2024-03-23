import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {GetCommand, GetCommandInput, PutCommand, ScanCommand, ScanCommandInput} from "@aws-sdk/lib-dynamodb"
import {fromIni} from "@aws-sdk/credential-provider-ini";
import {InternalServerError} from "../errors/InternalServerError";

export type PaginatedResult<T> = { Items: T[], LastEvaluatedKey: Record<string, any> | undefined };
const client = new DynamoDBClient({credentials: fromIni({ profile: process.env.AWS_PROFILE }), region: 'us-east-1'});

export const getItem = async <T>(params: GetCommandInput): Promise<T | undefined> => {
    const command = new GetCommand(params);
    const response = await client.send(command);
    if (!response.Item) {
        return;
    }
    return response.Item as T;
};

export const putItem = async (tableName: string, item: object): Promise<void> => {
    const command = new PutCommand({
        TableName: tableName,
        Item: item
    });
    try {
        await client.send(command);
    } catch (error: any) {
        throw new InternalServerError(`Error occurred while putting item ${item}`);
    }
};

export const scanItem = async <T> (params: ScanCommandInput) : Promise<PaginatedResult<T> | undefined> => {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    if (!response.Items || !response.Items.length) {
        return;
    }
    return {
        Items: response.Items as T[],
        LastEvaluatedKey: response.LastEvaluatedKey
    };
}

export const scanAllItems = async <T>(params: ScanCommandInput): Promise<T[]> => {
    let result = [] as T[];
    let response: PaginatedResult<T> | undefined;
    do {
        response = await scanItem(params);
        const responseItems = (response?.Items ?? []) as T[];
        result = result.concat(responseItems);
        params.ExclusiveStartKey = response?.LastEvaluatedKey;
    } while (response?.LastEvaluatedKey);
    return result;
};
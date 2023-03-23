import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, S3Backend } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { Instance } from "@cdktf/provider-aws/lib/instance";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "us-east-1",
    });

    const environment = process.env.ENVIRONMENT

    new S3Backend(this, {
      bucket: "test-api-cdktf",
      key: environment + "/terraform.tfstate",
      region: "us-east-1",
    });

    const ec2Instance = new Instance(this, "compute", {
      ami: "ami-0fd2c44049dd805b8",
      instanceType: "t2.micro",
    });

    new TerraformOutput(this, "public_ip", {
      value: ec2Instance.publicIp,
    });
  }
}

const app = new App();
new MyStack(app, "test-cdktf-ec2");
app.synth();

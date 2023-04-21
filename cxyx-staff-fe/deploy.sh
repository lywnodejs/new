echo "====== 当前目录 ======"
BASE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
echo "$BASE_DIR"

echo "====== 当前环境信息 ======"
ENV=$env
echo "env is $ENV"

echo "====== tar包下载地址 ======"
# 编译产出的tar包地址
PACKAGE_URL=$OE_ARTIFACTORY_URL
echo "package url is $PACKAGE_URL"
wget -O output.tar.gz $PACKAGE_URL
tar -xzf output.tar.gz

# 替换测试环境资源
SERVER_STATIC_PATH="/home/xiaoju/wujie_work/staff_fe/build"
SOURCE_PATH="$BASE_DIR/build"
echo "SOURCE_PATH is $SOURCE_PATH"
rm -rf $SERVER_STATIC_PATH
cp -r $SOURCE_PATH $SERVER_STATIC_PATH


echo "====== 部署结束 ======="
exit $?

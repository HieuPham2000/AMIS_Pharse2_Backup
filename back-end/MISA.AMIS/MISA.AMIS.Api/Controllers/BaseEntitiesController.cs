using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.AMIS.Core.Constants;
using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Interfaces.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MISA.AMIS.Api.Controllers
{
    /// <summary>
    /// Lớp controller cơ sở
    /// </summary>
    /// <typeparam name="MISAEntity">Lớp thực thể</typeparam>
    /// CreatedBy: PTHIEU (17/8/2021)
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BaseEntitiesController<MISAEntity> : ControllerBase where MISAEntity : class
    {
        #region Fields

        IBaseService<MISAEntity> _baseService;

        #endregion

        #region Constructors

        public BaseEntitiesController(IBaseService<MISAEntity> baseService)
        {
            _baseService = baseService;
        }

        #endregion

        #region Methods

        /// <summary>
        /// API lấy ra danh sách tất cả bản ghi
        /// </summary>
        /// <returns>
        /// - 200: lấy thành công, hiển thị danh sách bản ghi
        /// - 204: không có dữ liệu
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpGet]
        public IActionResult GetAllEntites()
        {
            try
            {
                // Lấy dữ liệu trả về thông qua service
                var entities = _baseService.GetAll().Data;

                return Ok(entities);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API lấy ra đối tượng thực thể theo khóa chính(id)
        /// </summary>
        /// <param name="entityId">Khóa chính(id)</param>
        /// <returns>
        /// - 200: lấy thành công
        /// - 204: không có dữ liệu
        /// - 400: lỗi entityId không đúng kiểu guid
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpGet("{entityId}")]
        public IActionResult GetEntityById(string entityId)
        {
            try
            {
                // parse string sang kiểu Guid
                if (Guid.TryParse(entityId, out var entityIdGuid))
                {
                    // Lấy dữ liệu trả về thông qua service
                    var serviceResult = _baseService.GetById(entityIdGuid);
                    var entity = serviceResult.Data;
                    if (entity != null)
                    {
                        return Ok(serviceResult);
                    }
                    return NoContent();

                }

                // trả về mã lỗi 400 nếu không parse được entityId sang Guid
                return BadRequest(new ServiceResult
                {
                    IsSuccess = false,
                    UserMsg = Core.Properties.Resources.Error,
                    DevMsg = Core.Properties.Resources.ErrorRequest,
                    ErrorCode = MISAErrorCode.ErrorCodeBadRequest
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API thêm mới đối tượng thực thể
        /// </summary>
        /// <param name="entity">Đối tượng cần thêm mới</param>
        /// <returns>
        /// - 201: thêm thành công
        /// - 204: không có bản ghi nào được thêm
        /// - 200: thất bại do có lỗi khi xử lý nghiệp vụ
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpPost]
        public IActionResult PostEntity(MISAEntity entity)
        {
            try
            {
                // Thực hiện service thêm mới
                var serviceResult = _baseService.Insert(entity);

                // TH thêm mới thành công: IsSuccess == true, số bản ghi thêm mới > 0
                if(serviceResult.IsSuccess && (int)serviceResult.Data > 0)
                {
                    return StatusCode(201, serviceResult);
                }

                // Trường hợp thêm mới thất bại do xử lý nghiệp vụ
                // Trường hợp số bản ghi thêm được bằng 0
                return Ok(serviceResult);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API chỉnh sửa thông tin đối tượng thực thể
        /// </summary>
        /// <param name="entity">Đối tượng cần cập nhật</param>
        /// <returns>
        /// - 200: chỉnh sửa thành công/ hoặc xảy ra lỗi nghiệp vụ
        /// - 400: lỗi request, entityId không đúng kiểu guid
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpPut("{entityId}")]
        public IActionResult PutEntity(string entityId, MISAEntity entity)
        {
            try
            {
                // parse string sang kiểu Guid
                if (Guid.TryParse(entityId, out var entityIdGuid))
                {
                    // Thực hiện service cập nhật/chỉnh sửa
                    // Trường hợp thực hiện thất bại do lỗi nghiệp vụ (serviceResult.IsSuccess == false)
                    // Trường hợp affected rows = 0
                    // Đều trả về mã 200
                    return Ok(_baseService.Update(entityIdGuid, entity));
                }

                // trả về mã lỗi 400 nếu không parse được entityId sang Guid
                return BadRequest(new ServiceResult
                {
                    IsSuccess = false,
                    UserMsg = Core.Properties.Resources.Error,
                    DevMsg = Core.Properties.Resources.ErrorRequest,
                    ErrorCode = MISAErrorCode.ErrorCodeBadRequest
                });

            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }


        /// <summary>
        /// API xóa đối tượng thực thể theo khóa chính(id)
        /// </summary>
        /// <param name="entityId">Khóa chính(id)</param>
        /// <returns>
        /// - 200: xóa thành công
        /// - 400: lỗi request, entityId không đúng kiểu Guid
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpDelete("{entityId}")]
        public IActionResult DeleteEntity(string entityId)
        {
            try
            {
                // parse string sang kiểu guid
                if (Guid.TryParse(entityId, out var entityIdGuid))
                {
                    // Thực hiện service xóa bản ghi
                    // TH affected row = 0
                    // vẫn trả về mã 200 (có thể trả về mã 404)
                    return Ok(_baseService.Delete(entityIdGuid));
                }

                // trả về mã lỗi 400 nếu không parse được entityId sang Guid
                return BadRequest(new ServiceResult
                {
                    IsSuccess = false,
                    UserMsg = Core.Properties.Resources.Error,
                    DevMsg = Core.Properties.Resources.ErrorRequest,
                    ErrorCode = MISAErrorCode.ErrorCodeBadRequest
                });

            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API xóa nhiều bản ghi
        /// </summary>
        /// <param name="entityIds">Danh sách Khóa chính(id)</param>
        /// <returns>
        /// - 200: xóa thành công
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (10/9/2021)
        [HttpDelete]
        public IActionResult DeleteManyEntities([FromBody] List<Guid> entityIds)
        {
            try
            {
                // TODO: Xử lý status code trả về khi xóa nhiều
                // Thực hiện service xóa bản ghi
                // Và trả về mã 200
                // (cả trong trường hợp số bản ghi xóa được = 0)
                return Ok(_baseService.DeleteMany(entityIds));
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        #endregion
    }
}
